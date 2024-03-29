import * as msal from "@azure/msal-browser";
import Vue, { PluginObject, VueConstructor } from "vue";

declare module "vue/types/vue" {
    interface Vue {
        $msal: MsalPlugin;
    }
}

export interface MsalPluginOptions {
    clientId: string;
    tenantId: string;
}

let msalInstance: msal.PublicClientApplication;

export let msalPluginInstance: MsalPlugin;

export class MsalPlugin implements PluginObject<MsalPluginOptions> {

    private pluginOptions: MsalPluginOptions = {
        clientId: "",
        tenantId: "",
    };

    public isAuthenticated = false;
    public username = '';
    public account: msal.AccountInfo | null = null


    public install(vue: VueConstructor<Vue>, options?: MsalPluginOptions): void {
        if (!options) {
            throw new Error("MsalPluginOptions must be specified");
        }
        this.pluginOptions = options;
        this.initialize(options);
        msalPluginInstance = this;
        vue.prototype.$msal = Vue.observable(msalPluginInstance);
    }

    private initialize(options: MsalPluginOptions) {
        const msalConfig: msal.Configuration = {
            auth: {
                clientId: options.clientId,
                authority: `https://login.microsoftonline.com/${options.tenantId}`,
                redirectUri: '/redirect',
                postLogoutRedirectUri: '/',
                navigateToLoginRequestUrl: false
            },
            cache: {
                cacheLocation: 'sessionStorage',
                storeAuthStateInCookie: false,
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level: msal.LogLevel, message: string, containsPii: boolean): void => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case msal.LogLevel.Error:
                                console.error(message);
                                return;
                            case msal.LogLevel.Info:
                                console.info(message);
                                return;
                            case msal.LogLevel.Verbose:
                                console.debug(message);
                                return;
                            case msal.LogLevel.Warning:
                                console.warn(message);
                                return;
                        }
                    },
                    piiLoggingEnabled: false,
                    logLevel: msal.LogLevel.Verbose
                }
            }
        };
        msalInstance = new msal.PublicClientApplication(msalConfig);
        this.isAuthenticated = this.getIsAuthenticated();
    }


    public async signIn() {
        try {
            const loginRequest: msal.RedirectRequest = {
                redirectUri: '/redirect',
                scopes: ["api://helloworld.com/user_impersonation"],
            };
            msalInstance.loginRedirect(loginRequest);
            // this.isAuthenticated = !!loginResponse.account;
            // do something with this?
        } catch (err) {
            console.log(err);
            // handle error
            // if (err.errorMessage && err.errorMessage.indexOf("AADB2C90118") > -1) {
            //     try {
            //         const passwordResetResponse: msal.AuthenticationResult = await msalInstance.loginPopup({
            //             scopes: ["openid", "profile", "offline_access", "<The scope for your API>"],
            //             authority: this.pluginOptions.passwordAuthority
            //         });
            //          this.isAuthenticated = !!passwordResetResponse.account;
            //     } catch (passwordResetError) {
            //         console.error(passwordResetError);
            //     }
            // } else {
            //     this.isAuthenticated = false;
            // }

        }
    }

    public handleRedirect (response: any) {
        console.log("handle here");
        msalInstance.handleRedirectPromise().then((response) => {
            if (response !== null) {
                this.account = response.account;
                msalInstance.setActiveAccount(response.account)
            } else {
                const currentAccounts = msalInstance.getAllAccounts();
                if (currentAccounts.length === 1) {
                    this.account = currentAccounts[0];
                    msalInstance.setActiveAccount(this.account)
                }
            }
            console.log("token: ");
            console.log(response);
            // Check if the tokenResponse is null
            // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
            // If the tokenResponse === null, you are not coming back from an auth redirect.
        }).catch((error) => {
            console.log(error);
            // handle error, either in the library or coming back from the server
        });
    }

    public async signOut() {
        await msalInstance.logoutRedirect();
        this.isAuthenticated = false;
    }

    public async acquireToken() {
        const request = {
            account: msalInstance.getAllAccounts()[0],
            scopes: ["<The scope for your API>"]
        };
        try {
            const response = await msalInstance.acquireTokenSilent(request);
            return response.accessToken;
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                return msalInstance.acquireTokenPopup(request).catch((popupError) => {
                    console.error(popupError);
                });
            }
            return false;
        }
    }

    private getIsAuthenticated(): boolean {
        const accounts: msal.AccountInfo[] = msalInstance.getAllAccounts();
        return accounts && accounts.length > 0;
    }
}