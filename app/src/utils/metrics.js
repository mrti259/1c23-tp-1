import StatsD from "hot-shots";

const errorHandler = (error) => {
  console.error("Error sending metric", error);
};

const metrics = new StatsD({
  host: "graphite",
  port: 8125,
  errorHandler: errorHandler,
  tcpGracefulErrorHandling: true,
  udsGracefulErrorHandling: true,
});

const sendMetric = (metric, startDate) => {
  metrics.timing(metric, new Date() - startDate);
};

export const metricsFnWrapper = async (name, fn) => {
  const start = new Date();
  let response;
  try {
    response = await fn();
  } catch (error) {
    console.log("Metrica FN enviada ERROR");
    sendMetric(`${name}-fn-process-time`, start);
    throw error;
  }
  console.log("Metrica FN enviada");
  sendMetric(`${name}-fn-process-time`, start);
  return response;
};

export const metricsControllerWrapper = (name, controller) => {
  return async (req, res) => {
    const start = new Date();
    await controller(req, res);
    console.log("Metrica CONTROLLER enviada");
    sendMetric(`${name}-process-time`, start);
  };
};
