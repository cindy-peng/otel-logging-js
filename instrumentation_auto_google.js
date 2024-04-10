const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
    TraceExporter,
} = require("@google-cloud/opentelemetry-cloud-trace-exporter");

const sdk = new NodeSDK({
    traceExporter: new TraceExporter(),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();