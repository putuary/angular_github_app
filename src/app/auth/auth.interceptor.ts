import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { BYPASS_LOGGIN } from '../../shared/constant/context.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.context.get(BYPASS_LOGGIN)) {
    return next(req);
  } else {
    const headers = req.headers;
    const authToken = inject(AuthService).getAuthToken();

    const newReq = req.clone({
      headers: headers.append('Authorization', authToken),
    });
    
    return next(newReq);
  }
};
