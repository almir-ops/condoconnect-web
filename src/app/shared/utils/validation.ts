import { validPhone, normalizePhone, PHONE_ERROR } from './phone';

export type FieldErrors = Record<string, string>;
export function normalizeDocument(value: string): string {
  return value.trim().toUpperCase().replace(/[.\/\-\s]/g, '');
}
export function validDocument(value: unknown): boolean {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9.\/\-\s]+$/.test(value)) return false;
  const n = normalizeDocument(value);
  if (/^(\d)\1+$/.test(n)) return false;
  if (/^\d{11}$/.test(n)) {
    for (const size of [9, 10]) {
      let sum = 0;
      for (let i = 0; i < size; i++) sum += Number(n[i]) * (size + 1 - i);
      if ((sum * 10 % 11 % 10) !== Number(n[size])) return false;
    }
    return true;
  }
  if (!/^[A-Z0-9]{12}\d{2}$/.test(n)) return false;
  for (const size of [12, 13]) {
    let sum = 0, weight = 2;
    for (let i = size - 1; i >= 0; i--) {
      sum += (n.charCodeAt(i) - 48) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    const remainder = sum % 11;
    if ((remainder < 2 ? 0 : 11 - remainder) !== Number(n[size])) return false;
  }
  return true;
}
export function validEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const n = value.trim();
  return n.length <= 150 && /^[^\s@\x00-\x1f\x7f]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(n);
}
export function validCep(value: unknown): boolean {
  return typeof value === 'string' && /^\d{5}-?\d{3}$/.test(value.trim());
}
type Rule = { max: number; kind?: 'email' | 'phone' | 'document' | 'cep'; required?: boolean; multiline?: boolean };
const names: Record<string,string> = {nome:'Nome',email:'E-mail',senha:'Senha',newPassword:'Nova senha',telefone:'Telefone',celular:'Celular',cnpj:'CPF/CNPJ',cpf:'CPF/CNPJ',cep:'CEP',descricao:'Descrição',slogan:'Slogan',endereco:'Endereço',bairro:'Bairro',complemento:'Complemento',numero:'Número',cidade:'Cidade',estado:'Estado',token:'Token'};
const base: Record<string,Rule> = {
  nome:{max:100}, email:{max:150,kind:'email'}, telefone:{max:20,kind:'phone'},
  celular:{max:20,kind:'phone'}, cnpj:{max:20,kind:'document'}, cpf:{max:20,kind:'document'},
  cep:{max:9,kind:'cep'}, endereco:{max:255}, bairro:{max:255}, complemento:{max:255},
  numero:{max:255}, cidade:{max:100}, estado:{max:50}, descricao:{max:1000,multiline:true},
  slogan:{max:100}, site_url:{max:255}, facebook_url:{max:255}, instagram_url:{max:255}, youtube_url:{max:255},
};
export function validationProfile(method: string, path: string): string | null {
  const p = path.split('?')[0].replace(/^\/+|\/+$/g,'');
  if (method === 'POST' && /^auth\/(register|login|forgot|reset)$/.test(p)) return p;
  if (method === 'PUT' && /^auth\/update\/[^/]+$/.test(p)) return 'user-update';
  if (method === 'POST' && p === 'inscricoes') return 'subscription';
  if (['POST','PUT','PATCH'].includes(method) &&
      /^(empresas|condominios|cidades|categorias|subcategorias)(\/[^/]+)?$/.test(p) &&
      !(method === 'POST' && p.includes('/'))) {
    return p.split('/')[0] + (p.includes('/') ? '-update' : '-create');
  }
  return null;
}
export function validatePayload(profile: string, input: unknown): {data: any; errors: FieldErrors} {
  const errors: FieldErrors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {data: input, errors:{body:'Envie um objeto com os dados do formulário.'}};
  const data = {...input as Record<string,unknown>};
  let rules: Record<string,Rule> = {};
  if (profile.startsWith('auth/') || profile === 'user-update') {
    rules = profile === 'auth/register' || profile === 'user-update'
      ? {nome:{max:255},email:base['email'],telefone:base['telefone']} : {};
    if (profile === 'auth/register' || profile === 'auth/login') rules['senha'] = {max:255,required:true};
    if (['auth/register','auth/login','auth/forgot'].includes(profile)) rules['email'] = {...base['email'],required:true};
    if (profile === 'auth/register') rules['telefone'] = {...base['telefone'],required:true};
    if (profile === 'user-update' && 'email' in data) rules['email'] = {...base['email'],required:true};
    if (profile === 'auth/reset') rules = {newPassword:{max:255,required:true},token:{max:4096,required:true}};
  } else if (profile === 'subscription') {
    rules = {cpf:base['cpf']}; // Obrigatoriedade depende do plano consultado pelo servidor.
  } else {
    rules = {...base};
    if (profile.endsWith('-create')) {
      rules['nome'] = {...base['nome'],required:true};
      if (profile === 'empresas-create') rules['email'] = {...base['email'],required:true};
    } else {
      if ('nome' in data) rules['nome'] = {...base['nome'],required:true};
      if (profile.startsWith('empresas') && 'email' in data) rules['email'] = {...base['email'],required:true};
    }
    if (profile.startsWith('condominios')) rules['email'] = {...rules['email'],max:50};
  }
  for (const [field,rule] of Object.entries(rules)) {
    const raw = data[field];
    if (raw === undefined && !rule.required) continue;
    const label = names[field] || field;
    const secret = field === 'senha' || field === 'newPassword';
    if (raw == null || (typeof raw === 'string' && !raw.trim())) {
      if (rule.required) errors[field] = label + ' é obrigatório.';
      else if (typeof raw === 'string') data[field] = '';
      continue;
    }
    if (typeof raw !== 'string') {errors[field] = label + ' deve ser um texto.'; continue;}
    const value = secret ? raw : raw.trim();
    const controls = rule.multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/;
    if (controls.test(value)) {errors[field] = label + ' contém caracteres inválidos.'; continue;}
    if (value.length > rule.max) {errors[field] = label + ' deve ter no máximo ' + rule.max + ' caracteres.'; continue;}
    if (rule.kind === 'email') {
      if (!validEmail(value)) errors[field] = 'Informe um e-mail válido.';
      else data[field] = value.toLowerCase();
    } else if (rule.kind === 'phone') {
      if (!validPhone(value)) errors[field] = PHONE_ERROR;
      else data[field] = normalizePhone(value);
    } else if (rule.kind === 'document') {
      if (!validDocument(value)) errors[field] = 'Informe um CPF ou CNPJ válido.';
      else data[field] = normalizeDocument(value);
    } else if (rule.kind === 'cep') {
      if (!validCep(value)) errors[field] = 'Informe um CEP com 8 dígitos.';
      else data[field] = value.replace('-','');
    } else data[field] = value;
  }
  return {data,errors};
}
export function validationError(errors: FieldErrors) {
  const message = Object.values(errors).join(' ');
  return {code:'VALIDATION_ERROR',message,error:message,field:Object.keys(errors)[0],errors};
}
