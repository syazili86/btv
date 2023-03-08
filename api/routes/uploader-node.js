/* eslint-disable standard/no-callback-literal */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import fs from 'fs'
import resolve from 'path'

export default flow = function (temporaryFolder) {
  const $ = this
  $.temporaryFolder = temporaryFolder
  $.maxFileSize = null
  $.fileParameterName = 'file'

  try {
    fs.mkdirSync($.temporaryFolder)
  } catch (e) {}

  function cleanIdentifier (identifier) {
    return identifier.replace(/[^0-9A-Za-z_-]/g, '')
  }

  function getChunkFilename (chunkNumber, identifier) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier)
    // What would the file name be?
    return resolve($.temporaryFolder, './content-' + identifier + '.' + chunkNumber)
  }

  function validateRequest (chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier)

    // Check if the request is sane
    if (chunkNumber === 0 || chunkSize === 0 || totalSize === 0 || identifier.length === 0 || filename.length === 0) {
      return 'non_uploader_request'
    }
    const numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1)
    if (chunkNumber > numberOfChunks) {
      return 'invalid_uploader_request1'
    }

    // Is the file too big?
    if ($.maxFileSize && totalSize > $.maxFileSize) {
      return 'invalid_uploader_request2'
    }

    if (typeof (fileSize) !== 'undefined') {
      if (chunkNumber < numberOfChunks && fileSize !== chunkSize) {
        // The chunk in the POST request isn't the correct size
        return 'invalid_uploader_request3'
      }
      if (numberOfChunks > 1 && chunkNumber === numberOfChunks && fileSize !== ((totalSize % chunkSize) + parseInt(chunkSize))) {
        // The chunks in the POST is the last one, and the fil is not the correct size
        return 'invalid_uploader_request4'
      }
      if (numberOfChunks === 1 && fileSize !== totalSize) {
        // The file is only a single chunk, and the data size does not fit
        return 'invalid_uploader_request5'
      }
    }

    return 'valid'
  }

  // 'found', filename, original_filename, identifier
  // 'not_found', null, null, null
  $.get = function (req, callback) {
    const chunkNumber = req.param('chunkNumber', 0)
    const chunkSize = req.param('chunkSize', 0)
    const totalSize = req.param('totalSize', 0)
    const identifier = req.param('identifier', '')
    const filename = req.param('filename', '')

    if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) === 'valid') {
      const chunkFilename = getChunkFilename(chunkNumber, identifier)
      fs.stat(chunkFilename, function (exists) {
        if (exists) {
          callback('found', chunkFilename, filename, identifier)
        } else {
          callback('not_found', null, null, null)
        }
      })
    } else {
      callback('not_found', null, null, null)
    }
  }

  // 'partly_done', filename, original_filename, identifier
  // 'done', filename, original_filename, identifier
  // 'invalid_uploader_request', null, null, null
  // 'non_uploader_request', null, null, null
  $.post = function (req, callback) {
    const fields = req.body
    const files = req.files

    const chunkNumber = fields['chunkNumber']
    const chunkSize = fields['chunkSize']
    const totalSize = fields['totalSize']
    const identifier = cleanIdentifier(fields['identifier'])
    const filename = fields['filename']

    if (!files[$.fileParameterName] || !files[$.fileParameterName].size) {
      callback('invalid_uploader_request', null, null, null)
      return
    }

    const original_filename = files[$.fileParameterName]['originalFilename']
    const validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, files[$.fileParameterName].size)
    if (validation === 'valid') {
      const chunkFilename = getChunkFilename(chunkNumber, identifier)

      // Save the chunk (TODO: OVERWRITE)
      fs.rename(files[$.fileParameterName].path, chunkFilename, function () {
        // Do we have all the chunks?
        let currentTestChunk = 1
        const numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1)
        const testChunkExists = function () {
          fs.stat(getChunkFilename(currentTestChunk, identifier), function (exists) {
            if (exists) {
              currentTestChunk++
              if (currentTestChunk > numberOfChunks) {
                callback('done', filename, original_filename, identifier)
              } else {
                // Recursion
                testChunkExists()
              }
            } else {
              callback('partly_done', filename, original_filename, identifier)
            }
          })
        }
        testChunkExists()
      })
    } else {
      callback(validation, filename, original_filename, identifier)
    }
  }

  // Pipe chunks directly in to an existsing WritableStream
  //   r.write(identifier, response)
  //   r.write(identifier, response, {end:false})
  //
  //   const stream = fs.createWriteStream(filename)
  //   r.write(identifier, stream)
  //   stream.on('data', function(data){...})
  //   stream.on('finish', function(){...})
  $.write = function (identifier, writableStream, options) {
    options = options || {}
    options.end = (typeof options['end'] === 'undefined' ? true : options['end'])

    // Iterate over each chunk
    const pipeChunk = function (number) {
      const chunkFilename = getChunkFilename(number, identifier)
      fs.stat(chunkFilename, function (exists) {
        if (exists) {
          // If the chunk with the current number exists,
          // then create a ReadStream from the file
          // and pipe it to the specified writableStream.
          const sourceStream = fs.createReadStream(chunkFilename)
          sourceStream.pipe(writableStream, {
            end: false
          })
          sourceStream.on('end', function () {
            // When the chunk is fully streamed,
            // jump to the next one
            pipeChunk(number + 1)
          })
        } else {
          // When all the chunks have been piped, end the stream
          if (options.end) writableStream.end()
          if (options.onDone) options.onDone()
        }
      })
    }
    pipeChunk(1)
  }

  $.clean = function (identifier, options) {
    options = options || {}

    // Iterate over each chunk
    const pipeChunkRm = function (number) {
      const chunkFilename = getChunkFilename(number, identifier)

      // console.log('removing pipeChunkRm ', number, 'chunkFilename', chunkFilename)
      fs.stat(chunkFilename, function (exists) {
        if (exists) {
          console.log('exist removing ', chunkFilename)
          fs.unlink(chunkFilename, function (err) {
            if (err && options.onError) options.onError(err)
          })

          pipeChunkRm(number + 1)
        } else {
          if (options.onDone) options.onDone()
        }
      })
    }
    pipeChunkRm(1)
  }

  return $
}
