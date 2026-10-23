function notFound(req, res) {
  res.status(404).json({
    message: "Сұралған маршрут табылмады.",
  });
}

// Express қате өңдегіші міндетті түрде төрт параметр қабылдайды.
function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "JSON форматы дұрыс емес.",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message: "Сұраныс көлемі тым үлкен. Шектеу — 16 KB.",
    });
  }

  if (
    error.type === "charset.unsupported" ||
    error.type === "encoding.unsupported"
  ) {
    return res.status(415).json({
      message: "Сұраныстың кодталу түріне қолдау көрсетілмейді.",
    });
  }

  if (
    error.type === "request.aborted" ||
    error.type === "request.size.invalid"
  ) {
    return res.status(400).json({
      message: "Сұраныс толық немесе дұрыс жіберілмеген.",
    });
  }

  if (error instanceof URIError && error.status === 400) {
    return res.status(400).json({
      message: "Мекенжай параметрлерінің форматы дұрыс емес.",
    });
  }

  // Request body, cookie және құпия деректерді логқа жазбаймыз.
  console.error("Өңделмеген сервер қатесі:", {
    method: req.method,
    name: error.name,
    code: error.code,
  });

  return res.status(500).json({
    message: "Серверде қате пайда болды. Кейінірек қайталап көріңіз.",
  });
}

module.exports = {
  notFound,
  errorHandler,
};