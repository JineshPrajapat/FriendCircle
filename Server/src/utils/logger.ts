import { Request, Response } from 'express';
import colors from 'colors';

const logger = {
  logRequest: (req: Request, res: Response): void => {
    const { method, url, httpVersion } = req;
    const statusCode = res.statusCode;

    const statusMessage = getStatusMessage(statusCode);
    const color = getColorForStatusCode(statusCode);

    console.log(
      color(`INFO: ${req.ip}:${req.socket.remotePort} - "${colors.bold(method)} ${colors.bold(url)} HTTP/${httpVersion}" ${statusCode} ${statusMessage}`)
    );
  },

  // Function to log info-level messages
  info: (message: string): void => {
    console.log(colors.blue(`[INFO] ${message}`));
  },

  // Function to log error-level messages
  error: (message: string): void => {
    console.error(colors.red(`[ERROR] ${message}`));
  },

  // Function to log debug-level messages
  debug: (message: string): void => {
    console.debug(colors.gray(`[DEBUG] ${message}`));
  },
};

function getStatusMessage(statusCode: number): string {
  switch (statusCode) {
    case 200:
      return 'OK';
    case 422:
      return 'Unprocessable Entity';
    case 404:
      return 'Not Found';
    case 500:
      return 'Internal Server Error';
    default:
      return 'Unknown Status';
  }
}

function getColorForStatusCode(statusCode: number): (str: string) => string {
  if (statusCode >= 200 && statusCode < 300) {
    return colors.green;
  } else if (statusCode >= 400 && statusCode < 500) {
    return colors.yellow; 
  } else if (statusCode >= 500) {
    return colors.red; 
  }
  return colors.white; 
}

export default logger;
