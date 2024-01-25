export default function DescribeServer() {
    const { AUTH_AVAILABLE_USERNAMES, PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } = process.env;
    const availableUserDomains = AUTH_AVAILABLE_USERNAMES?.split(' ') || [];
    const privacyPolicy = PRIVACY_POLICY_URL;
    const termsOfService = TERMS_OF_SERVICE_URL;

    const server: {
        availableUserDomains: string[];
        links?: {
            privacyPolicy?: string;
            termsOfService?: string;
        }
    } = {
        availableUserDomains,
    }

    if (privacyPolicy) server.links = { ...server.links, privacyPolicy };
    if (termsOfService) server.links = { ...server.links, termsOfService };

    return server;
}