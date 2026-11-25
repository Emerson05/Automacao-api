import { test, expect, TestInfo } from '@playwright/test';
import {LoginPage} from '../pages/login_page';
import {HomePage} from '../pages/home_page';
import {ADMIN, KathflixApi} from '../api_helper/kathflix_api';
import { beforeEach } from 'node:test';

const SENHA_USUARIO_TESTE = 'Senha123';
//Apenas os cenarios listados aqui{pelo nome do teste} precisa de um usuário criado 
const CENARIOS_COM_USUARIO = ['Login com sucesso']

let loginPage: LoginPage;
let homePage: HomePage;
const api = new KathflixApi();
let prefixo: string;
let createUser: string;

function precisaDoUsuario(testInfo: TestInfo): boolean{

     return CENARIOS_COM_USUARIO.some((nome) => testInfo.title.includes(nome));

}

test.beforeEach(async ({page}, testInfo) => {
    loginPage = new LoginPage(page)
    homePage= new HomePage(page)

    if(precisaDoUsuario(testInfo)){
        prefixo = `autoLogin-${Date.now()}-${testInfo.workerIndex}`
        createUser = await api.criarUsuario(prefixo, SENHA_USUARIO_TESTE )
    }

    await loginPage.acessarSite();

});
test("Login com sucesso", async ({ page }) => {

    await loginPage.login(createUser,SENHA_USUARIO_TESTE)
    await expect(page).toHaveURL(/home.html/)
    await expect(homePage.username).toHaveText('Usuário Automacao')

})

