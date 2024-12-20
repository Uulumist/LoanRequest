import {test, expect} from '@playwright/test'
import {LoginPage} from "./pages/login-page";
import {LoanPage} from "./pages/loan-page";

let loginPage: LoginPage

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page)
    await loginPage.openLoanRequestPage()
})

test('All elements are visible on loan page', async ({page}) => {
    await expect.soft(loginPage.inputAmount).toBeVisible()
    await expect.soft(loginPage.dropdownPeriod).toBeVisible()
    await expect.soft(loginPage.scrollAmount).toBeInViewport()
    await expect.soft(loginPage.scrollPeriod).toBeInViewport()
    await expect.soft(loginPage.buttonApplyNow).toBeVisible()
    await expect.soft(loginPage.textMonthlyPeriodCalc).toBeVisible()
});

test('modify slider value and verify monthly payment changed', async ({page}) => {
    const initialAmount = await loginPage.textMonthlyPeriodCalc.textContent()
    console.log('>>> initial value: ', initialAmount)
    await loginPage.scrollPeriod.fill('20');
    let updatedValue = initialAmount;
    let counter = 0
    while (updatedValue === initialAmount || counter <= 10) {
        console.log('checking ...');
        await page.waitForTimeout(500);
        updatedValue = await loginPage.textMonthlyPeriodCalc.textContent();
        counter++
        if (counter >= 10) {
            test.fail
        }
    }
    console.log('>>> updated value: ', await loginPage.textMonthlyPeriodCalc.textContent())
})

test('e2e login scenario', async ({page}) => {
    await loginPage.buttonApplyNow.click()
    await loginPage.inputUsername.fill('test')
    await loginPage.inputPassword.fill('asd123')
    await loginPage.buttonContinue.click()
    const loanPage = new LoanPage(page)
    await expect.soft(loanPage.textFullName).toBeVisible()
    await expect.soft(loanPage.textCommunicationLang).toBeVisible()
    await expect.soft(loanPage.buttonContinue).toBeVisible()
    await loanPage.buttonContinue.click()
    await expect.soft(loanPage.textSuccess).toBeVisible()
    await expect.soft(loanPage.buttonOk).toBeVisible()
});