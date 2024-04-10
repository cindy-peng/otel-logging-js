const { trace, context } = require('@opentelemetry/api');

const tracer = trace.getTracer('dice-lib');
const {logHttpRequest} = require('./logger2.js');

function rollOnceWitoutSpan(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  function rollTheDiceWithoutSpan(rolls, min, max) {
    const result = [];
    for (let i = 0; i < rolls; i++) {
      result.push(rollOnce(min, max));
    }
    return result;
  }

  function rollOnce(req, i, min, max) {
    return tracer.startActiveSpan(`rollOnce:${i}`, (span) => {
      const activeContext = context.active();

       const childSpanContext = trace.getSpanContext(activeContext);
      const trace_id = childSpanContext.traceId;
      const span_id = childSpanContext.spanId;
      // console.log("childSpanContext", childSpanContext);

      const result = Math.floor(Math.random() * (max - min) + min);
      logHttpRequest(req, trace_id, span_id);
       // Add an attribute to the span
    span.setAttribute('dicelib.rolled', result.toString());

      span.end();
      return result;
    });
  }

  function rollTheDice(req, rolls, min, max) {
    // Create a span. A span must be closed.
    return tracer.startActiveSpan('rollTheDice', (parentSpan) => {

      
      
    //   const parentSpanContext = trace.getSpanContext(parentContext);
       console.log("parentSpan", parentSpan);
      const result = [];
      for (let i = 0; i < rolls; i++) {
        result.push(rollOnce(req, i, min, max));
      }
      // Be sure to end the span!
      parentSpan.end();
      return result;
    });
  }
  
  module.exports = { rollTheDice };