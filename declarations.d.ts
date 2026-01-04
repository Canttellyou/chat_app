declare module "*.png" {
  const value: any;
  export default value;
}

declare module "@env" {
  export const API_URL: string;
}
