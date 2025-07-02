async function printMessage(message: string) {
  try {
    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject(error);
  }
}
export const demoService = { printMessage };
