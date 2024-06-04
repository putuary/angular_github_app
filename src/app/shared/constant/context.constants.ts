import { HttpContextToken } from "@angular/common/http";

export const BYPASS_LOGGIN = new HttpContextToken<boolean>(() => false);