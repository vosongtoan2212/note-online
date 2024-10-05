export interface CustomResponse {
  code: number;
  message: string;
  data: any;
}

export function formatResponse(
  code: number,
  message: string,
  data: any = null,
): CustomResponse {
  return {
    code,
    message,
    data,
  };
}
