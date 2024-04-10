const {Logging} = require('@google-cloud/logging');
//const { HeaderWrapper, makeHeaderWrapper } = require('@google-cloud/logging/build/src/utils/context');
// import * as extend from 'extend';

function logHttpRequest(
    req,
//    tracer,
  traceId="",
  spanId="",
    projectId = 'cindy-cloud-sdk-test', // Your Google Cloud Platform project ID
    logName = 'my-log', // The name of the log to write to
    requestMethod = 'GET', // GET, POST, PUT, etc.
    requestUrl = 'http://www.google.com',
    status = 200,
    userAgent = 'my-user-agent/1.0.0',
    latencySeconds = 3,
    responseSize = 256 // response size in bytes.
  ) {

   

    console.log("request headers", req.header("haha"));
    console.log("request headers traceid", req.header("traceid"));
    console.log("request headers X-Cloud-Trace-Context", req.header("X-Cloud-Trace-Context"));
    // Imports the Google Cloud client library
  
    // Creates a client
    const logging = new Logging({projectId});
  
    // Selects the log to write to
    const log = logging.log(logName);
  
    // The data to write to the log
    const text = 'Hello, Cindy!';


   // req.header("X-Cloud-Trace-Context") = traceId + "/" + spanId + ";o=1";


      // const req1 = {
      //   originalUrl: 'http://google.com/',
      //   method: 'GET',
      //   url: 'http://google.com/',
      //   headers: {
      //  //   "x-cloud-trace-context": traceId + "/" + spanId + ";o=1",
      //  "x-cloud-trace-context": traceId + "/10;o=1",
      //     referer: 'some-referer',
      //   },
      // };
     // const req2 = extend(true, req, req1);

      const metadata = {
        resource: {type: 'global'},
        httpRequest: req,
      };
   // entry.metadata.httpRequest = req;
    console.log("request in metadata:",  metadata.httpRequest);

    // Prepares a log entry
    const entry = log.entry(metadata, text);
  
    // Writes the log entry
    async function writeLog() {
      await log.write(entry);
      console.log(`Logged: ${text}`);
    }
    writeLog();
    // [END logging_http_request]
    // [END logging_write_log_entry_advanced]
  }

  module.exports = { logHttpRequest };