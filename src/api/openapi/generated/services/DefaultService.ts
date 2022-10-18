/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns void
     * @throws ApiError
     */
    public root(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
            errors: {
                303: `Redirect to the API documentation`,
            },
        });
    }

    /**
     * @returns void
     * @throws ApiError
     */
    public swagger(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/swagger',
            errors: {
                303: `Redirect to the API documentation`,
            },
        });
    }

    /**
     * @returns string Health check response
     * @throws ApiError
     */
    public healthCheck(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/health',
        });
    }

    /**
     * @param authorization
     * @param xAuthorizationProvider
     * @param xAuthorizationContext
     * @returns any Access granted message
     * @throws ApiError
     */
    public authorizeRequest(
        authorization?: string,
        xAuthorizationProvider?: string,
        xAuthorizationContext?: string,
    ): CancelablePromise<{
        message?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authorize',
            headers: {
                'Authorization': authorization,
                'X-Authorization-Provider': xAuthorizationProvider,
                'X-Authorization-Context': xAuthorizationContext,
            },
            errors: {
                401: `Access denied message`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param appContext Base64-encoded object with attributes: {appName: string, redirectUrl: string}
     * @returns void
     * @throws ApiError
     */
    public openIdLoginRequest(
        provider: string,
        appContext: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/openid/{provider}/login-request',
            path: {
                'provider': provider,
            },
            query: {
                'appContext': appContext,
            },
            errors: {
                303: `Redirect to the authentication provider service`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param code Login code
     * @param state Login state string
     * @param acrValues
     * @param scope
     * @param sessionState
     * @param sid
     * @param nonce
     * @returns void
     * @throws ApiError
     */
    public openIdAuthenticateResponse(
        provider: string,
        code: string,
        state: string,
        acrValues?: string,
        scope?: string,
        sessionState?: string,
        sid?: string,
        nonce?: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/openid/{provider}/authenticate-response',
            path: {
                'provider': provider,
            },
            query: {
                'code': code,
                'state': state,
                'acr_values': acrValues,
                'scope': scope,
                'session_state': sessionState,
                'sid': sid,
                'nonce': nonce,
            },
            errors: {
                303: `Authentication providers callback url, redirect back to the app context, provide loginCode and provider -variables as query params`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param appContext Base64-encoded object with attributes: {appName: string, redirectUrl: string}
     * @param idToken Logout id_token hint
     * @returns void
     * @throws ApiError
     */
    public openIdLogoutRequest(
        provider: string,
        appContext: string,
        idToken?: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/openid/{provider}/logout-request',
            path: {
                'provider': provider,
            },
            query: {
                'appContext': appContext,
                'idToken': idToken,
            },
            errors: {
                303: `Redirect to the authentication provider services logout endpoint`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param state Base64-encoded object with attributes: {appName: string, redirectUrl: string}
     * @returns void
     * @throws ApiError
     */
    public openIdLogoutResponse(
        provider: string,
        state?: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/openid/{provider}/logout-response',
            path: {
                'provider': provider,
            },
            query: {
                'state': state,
            },
            errors: {
                303: `Authentication providers callback url, redirect back to the app context`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param requestBody Retrieve the authentication token from the auth provider service
     * @returns any Auth token
     * @throws ApiError
     */
    public openIdAuthTokenRequest(
        provider: string,
        requestBody: {
            loginCode: string;
            appContext: string;
        },
    ): CancelablePromise<{
        accessToken: string;
        idToken: string;
        /**
         * an ISO-8601 timestamp string that specifies the token expirity datetime
         */
        expiresAt: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/openid/{provider}/auth-token-request',
            path: {
                'provider': provider,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Access token retrieval failed`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param requestBody Retrieve user info from the auth provider service
     * @returns any User info object
     * @throws ApiError
     */
    public openIdUserInfoRequest(
        provider: string,
        requestBody: {
            accessToken: string;
            appContext: string;
        },
    ): CancelablePromise<{
        sub: string;
        inum?: string;
        email?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/openid/{provider}/user-info-request',
            path: {
                'provider': provider,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Login invalid or expired`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param appContext Base64-encoded object with attributes: {appName: string, redirectUrl: string}
     * @returns void
     * @throws ApiError
     */
    public saml2LoginRequest(
        provider: string,
        appContext: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/saml2/{provider}/login-request',
            path: {
                'provider': provider,
            },
            query: {
                'appContext': appContext,
            },
            errors: {
                303: `Redirect to the authentication provider service`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @returns void
     * @throws ApiError
     */
    public saml2AuthenticateResponse(
        provider: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/saml2/{provider}/authenticate-response',
            path: {
                'provider': provider,
            },
            errors: {
                303: `Authentication providers callback url, redirect back to the app context`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param appContext Base64-encoded object with attributes: {appName: string, redirectUrl: string}
     * @param idToken Logout id_token hint
     * @returns void
     * @throws ApiError
     */
    public saml2LogoutRequest(
        provider: string,
        appContext: string,
        idToken?: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/saml2/{provider}/logout-request',
            path: {
                'provider': provider,
            },
            query: {
                'appContext': appContext,
                'idToken': idToken,
            },
            errors: {
                303: `Redirect to the authentication provider service`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param samlResponse Logout response
     * @param relayState State string
     * @param sigAlg SigAlg
     * @param signature Signature
     * @returns void
     * @throws ApiError
     */
    public saml2LogoutResponse(
        provider: string,
        samlResponse: string,
        relayState: string,
        sigAlg: string,
        signature: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/saml2/{provider}/logout-response',
            path: {
                'provider': provider,
            },
            query: {
                'SAMLResponse': samlResponse,
                'RelayState': relayState,
                'SigAlg': sigAlg,
                'Signature': signature,
            },
            errors: {
                303: `Authentication providers callback url, redirect back to the app context`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param requestBody Retrieve the authentication token from the auth provider service
     * @returns any Auth token
     * @throws ApiError
     */
    public saml2AuthTokenRequest(
        provider: string,
        requestBody: {
            loginCode: string;
            appContext: string;
        },
    ): CancelablePromise<{
        accessToken: string;
        idToken: string;
        /**
         * an ISO-8601 timestamp string that specifies the token expirity datetime
         */
        expiresAt: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/saml2/{provider}/auth-token-request',
            path: {
                'provider': provider,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Access token retrieval failed`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @param requestBody Retrieve user info from the auth provider service
     * @returns any User info object
     * @throws ApiError
     */
    public saml2UserInfoRequest(
        provider: string,
        requestBody: {
            accessToken: string;
            appContext: string;
        },
    ): CancelablePromise<{
        profile: {
            nameID: string;
            email: string;
        };
        context: {
            AuthnContextClassRef: string;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/saml2/{provider}/user-info-request',
            path: {
                'provider': provider,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Login invalid or expired`,
            },
        });
    }

    /**
     * @param provider Auth provider ident
     * @returns any .well-known/jwks.json
     * @throws ApiError
     */
    public saml2WellKnownJwksRequest(
        provider: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/saml2/{provider}/.well-known/jwks.json',
            path: {
                'provider': provider,
            },
        });
    }

}
