import { ApiBase, Json } from "./common_api";

export const BASE_URL = process.env.KATHFLIX_URL ?? 'http://localhost:3000';
export const ADMIN = {
  email: 'admin@kathflix.com',
  password: 'admin123',
};

export class KathflixApi extends ApiBase {
    
  constructor(baseUrl: string = BASE_URL) {
     super(baseUrl);

  }

  // ----Autentication----
  async login(email:string, password:string): Promise<string> {
    const r =  await this.post<{token:string}>('/api/auth/login', {email, password})
    this.token = r.token;
    return r.token;
  }

  loginAdmin(){
    return this.login(ADMIN.email,ADMIN.password)
  }

  // setup / teardown
  resetBanco(){
    return this.post('/api/test/reset')
  }


async criarUsuario(prefixo: string, password: string, extra: Json = {}): Promise<string> {
  const email = `${prefixo}user@kathflix.com`; 
  await this.post('/api/test/seed', {
    users: [{
      name: 'Usuário Automacao', 
      email, 
      password,
      role: 'user',
      ...extra
    }]
  });
  return email;
}

  // Remove usuários que começam com o prefixo.
  limparPorPrefixo(prefixo: string){
    return this.delete('/api/test/cleanup',{prefix: prefixo})
  }
}

