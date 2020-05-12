const puppeteer = require("puppeteer");
async function tweetTwitterWithPuppeteer() {
  try {
    await handleBrowser();
    await loginTweeter();
    await tweetTweeter();
    await screenshot();
    await follow();
    await logOut();
  } catch (err) {
    console.log(err);
    return err;
  }
}

tweetTwitterWithPuppeteer();

async function handleBrowser() {
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 20,
    args: ["--start-maximized", "--disable-notifications"]
  });

  page = await browser.newPage();
}

async function loginTweeter() {
  try {
    let twitterAccount = {
      userField: "input[type=text]",
      passField: "input[type=password]",
      loginSubmit: "div[data-testid=LoginForm_Login_Button]"
    };
    await page.goto('https://twitter.com/login');

    await page.waitFor(2000);
    await page.waitForSelector(twitterAccount.userField);
    await page.click(twitterAccount.userField);
    await page.keyboard.type('xxxxxx@gmail.com');
    await page.waitForSelector(twitterAccount.passField);
    await page.click(twitterAccount.passField);
    await page.keyboard.type('xxxxxxxxxxx');
    await page.waitFor(2000);
    await page.waitForSelector(twitterAccount.loginSubmit);
    await page.click(twitterAccount.loginSubmit);
    await page.waitFor(3000);
  } catch (err) {
    console.log(err);
    return err;

  }
}

async function tweetTweeter() {
  try {
    await page.goto('https://twitter.com/home');
    await page.waitForSelector('.DraftEditor-editorContainer',{waitUntil:"networkidle2"});
    await page.click('.DraftEditor-editorContainer');
    await page.keyboard.type("xxxxxxxxxxx");
    await page.waitFor(3000);
    await page.waitForSelector("div[data-testid=tweetButtonInline]");
    await page.click("div[data-testid=tweetButtonInline]");
    await page.waitFor(5000);
    console.log("Tweet has been posted successfully.");
  } catch (err) {
    console.log(err);

  }
}

async function screenshot(){
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  await page.goto('https://twitter.com/TanviGupta__');
  await page.waitFor(7000);
  await page.screenshot({path: 'twitter.png'});
}

async function follow () {
  await page.goto('https://twitter.com/home', {waitUntil: 'networkidle2'});
  await page.waitFor('input[data-testid="SearchBox_Search_Input"]');
  await page.type('input[data-testid="SearchBox_Search_Input"]', '#a', {delay:25});
  await page.keyboard.press('Enter');
  await page.waitFor(2000) 
  let authorsSet = new Set()
  try {
      let previousHeight;
      for (let i = 0; i < 3; i++) {
          const elementHandles = await page.$$('a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-sdzlij.r-1loqt21.r-1adg3ll.r-ahm1il.r-1udh08x.r-o7ynqc.r-6416eg.r-13qz1uu');
          const propertyJsHandles = await Promise.all(
            elementHandles.map(handle => handle.getProperty('href'))
          );
          const urls = await Promise.all(
            propertyJsHandles.map(handle => handle.jsonValue())
          );

          urls.forEach(item => authorsSet.add(item))

          previousHeight = await page.evaluate('document.body.scrollHeight');
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
          await page.waitFor(2000);
      }
  } catch(e) {console.log(e); }

  console.log("-----")
  console.log(authorsSet);
  const urls = Array.from(authorsSet)
  for (let i = 0; i < urls.length; i++) {
    try {
      const url = urls[i];
      console.log(url);
      await page.goto(`${url}`);

      await page.waitFor(2000)
      await page.click('div[class="css-18t94o4 css-1dbjc4n r-1niwhzg r-p1n3y5 r-sdzlij r-1phboty r-rs99b7 r-1w2pmg r-1vuscfd r-1dhvaqw r-1fneopy r-o7ynqc r-6416eg r-lrvibr"]',{waitUntil: "networkidle2"})
      await page.waitFor(2000)
      await page.goBack();
    }
    catch(error) {
      console.error(error);
    }
  }
}

async function logOut() {
  await page.goto('https://twitter.com/settings/account');

await page.waitForSelector("div[data-testid=SideNav_AccountSwitcher_Button]", { visible: true });
    await page.click("div[data-testid=SideNav_AccountSwitcher_Button]");
    await page.waitFor(1000)
    await page.waitForSelector("a[data-testid=AccountSwitcher_MenuSheet_Logout_Button");
    await page.click("a[data-testid=AccountSwitcher_MenuSheet_Logout_Button]");
    await page.waitFor(1000)
    await page.waitForSelector("div[data-testid=confirmationSheetConfirm]");
    await page.click("div[data-testid=confirmationSheetConfirm]");
    console.log("Session out");
};
