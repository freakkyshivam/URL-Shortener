
import type { TokenPayload } from "./auth.js";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
