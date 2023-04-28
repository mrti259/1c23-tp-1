import StatsD from "hot-shots";

const metrics = new StatsD({
  host: "graphite",
  port: 8125,
  tcpGracefulErrorHandling: true,
  udsGracefulErrorHandling: true,
  errorHandler: (error) => {
    console.log("Error sending metric", error);
  },
});

function sendMetric(log, label, startTime) {
  console.log(log);
  metrics.timing(label, Date.now() - startTime);
}

export async function metricsFnWrapper(name, fn) {
  const startTime = Date.now();
  const response = await fn().catch(() => {
    sendMetric(
      "Metrica FN enviada ERROR",
      `${name}-fn-process-time`,
      startTime
    );
    throw error;
  });
  sendMetric("Metrica FN enviada", `${name}-fn-process-time`, startTime);
  return response;
}

export function metricsControllerWrapper(name, controller) {
  return async (req, res) => {
    const startTime = Date.now();
    await controller(req, res);
    sendMetric("Metrica CONTROLLER enviada", `${name}-process-time`, startTime);
  };
}
