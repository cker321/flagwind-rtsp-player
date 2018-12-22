/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 *  
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import path from "path";
import flagwind from "flagwind-core";
import WorkbenchBase = flagwind.WorkbenchBase;
import ApplicationContextBase = flagwind.ApplicationContextBase;
import ApplicationContext from "./context";

// tslint:disable-next-line:no-var-requires
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

const ipcMain = require('electron').ipcMain
// Electron 1.4.x 文档
// https://github.com/electron/electron/tree/1-4-x/docs 

export default class Workbench extends WorkbenchBase
{
    private _mainWindow: any;
    
    /**
     * 获取当前应用的主窗口。
     * @returns BrowserWindow
     */
    public get mainWindow(): any
    {
        return this._mainWindow;
    }
    
    /**
     * 初始化工作台的新实例。 
     * @param  {ApplicationContextBase} applicationContext
     */
    public constructor(context: ApplicationContextBase)
    {
        super(context);
    }
    
    /**
     * 当工作台打开时调用。
     * @async
     * @protected
     * @virtual
     * @param  {Array<string>} args
     * @returns void
     */
    protected async onOpen(args: Array<string>): Promise<void>
    {
        // 设置 VLC 的路径
        process.env["VLC_PLUGIN_PATH"] = path.join(__dirname, "../../node_modules/wcjs-prebuilt/bin/plugins");
        
        app.on("ready", async() =>
        {
            this.createMainWindow();
            
            // 注册全局快捷键
            globalShortcut.register("f6", () =>
            {
                this._mainWindow.openDevTools({detach: true});
            });

            // 注册全局快捷键
            globalShortcut.register("f11", () =>
            {
                this._mainWindow.setFullScreen(!this._mainWindow.isFullScreen());
            });
        });
        
        app.on("window-all-closed", () =>
        {
            app.quit();
        });
        
        app.on("activate", () =>
        {
            if(this._mainWindow === null)
            {
                this.createMainWindow();
            }
        });


        //远程页面中调用触发本地
        ipcMain.on('playvideo',function(event,param){
             console.log('playvideo',param);

             const modalPath = 'http://localhost:9080/?rtsp_path='+param
              //let win = new BrowserWindow({ width: 705, height: 250,resizable:false,autoHideMenuBar:true,type: 'desktop', icon: './ioc/download2.png' })
              let upwin = new BrowserWindow({ 
                width: 705, 
                height: 650,
                //autoHideMenuBar:true,
                type: 'desktop', 
                //icon: __dirname+'\\ioc\\upgrate2.png',
                //resizable:false,
                maximizable:false,
                 })
              //win.setApplicationMenu(null);
              upwin.on('closed', function() { 
                     upwin = null
               })
              upwin.loadURL(modalPath)
              upwin.show()

        })

    }

    /**
     * 创建主窗口。
     * @returns void
     */
    private createMainWindow(): void
    {
        let context = this.applicationContext as ApplicationContext;
        
        // 测试版默认打开为最大化
        this._mainWindow = new BrowserWindow
        ({
            width: 1460,
            height: 900,
            useContentSize: false
        });
        
        if(process.env.NODE_ENV === "development")
        {
            // 隐藏菜单栏
            this._mainWindow.setMenuBarVisibility(false);
        }
        
        // 打开主地址
        this._mainWindow.loadURL(context.mainUrl);

        // 绑定关闭事件
        this._mainWindow.on("closed", () =>
        {
            // 释放主窗口
            this._mainWindow = null;
        });
    }
}
