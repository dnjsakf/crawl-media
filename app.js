const path = require("path");
const ChromeDriver = require("chromedriver"); // only load
const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");

(async function(profile="default"){
  const options = new Options();
  options.addArguments("start-maximized");
  options.addArguments(`--user-data-dir=${path.join(__dirname,"profiles")}`);
  options.addArguments(`--profile-directory=${profile}`);
  options.addArguments("--js-flags=--expose-gc");
  options.addArguments("--enable-precise-memory-info");
  // options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-gpu");
  options.addArguments("--disable-extensions");
  options.addArguments("--disable-popup-blocking");
  options.addArguments("--disable-default-apps");
  options.addArguments("--disable-infobars");
  options.excludeSwitches(["enable-logging", "enable-automation"]); // enable-automation: 자동화 테스트~ 팝업 X

  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  // Setting Timeout
  console.log(await driver.manage().getTimeouts());
  await driver.manage().setTimeouts({
    implicit: 10*1000, // 10*1000, // default: 0, element가 로딩이 될 때까지 기다리는 시간 설정
    pageLoad: 30*1000, // default: 30000 ms, 페이지가 로딩이 될 때까지 기다리는 시간 설정
    script: 30*1000,   // default 30000 ms, script가 로딩이 될 때까지 기다리는 시간 설정
  });
  
  let searchText = "다이나믹 듀오";

  await driver.get(`https://www.youtube.com/results?search_query=${searchText}`); // https://www.youtube.com/embed/ys1J98saOnY
  try {
    // New Tab
    //await driver.executeScript('window.open("about:blank", "_blank");');
    
    // Switch Tab
    const tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[0]); // 첫번째 Tab

    const results = await driver.findElements(By.xpath(`//*[@id="video-title"]`));
    await driver.wait(()=>(until.elementIsVisible(results)), 5*1000);

    const firstVideo = results[0];
    const videoHref = await firstVideo.getAttribute("href");
    console.log( videoHref );
    await firstVideo.click();

    await new Promise((resolve, _)=>(setTimeout(resolve, 3*1000)));

    // https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false
    const ytInitialPlayerResponse = await driver.executeScript("return ytcfg;");
    console.log(ytInitialPlayerResponse);

    /*
    const video = await driver.findElement(By.xpath(`//*[@id="page-manager"]/ytd-watch-flexy`));
    await driver.wait(()=>(until.elementIsVisible(video)), 5*1000);
    console.log( video );
    const videoId = await video.getAttribute("video-id");
    console.log( videoId );
    */
        
  } catch ( err ){
    console.error(err);

  } finally {
    await new Promise((resolve, _)=>(setTimeout(resolve, 1*1000)));
    // await driver.quit();
  }
})();
