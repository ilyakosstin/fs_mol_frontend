namespace $ {
    export function $tox_util_decode_jwt(token: string) {
        try {
            // 1. Get the payload segment (the second part of the token)
            const base64Url = token.split('.')[1];
            
            // 2. Replace Base64Url characters with standard Base64 characters
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            
            // 3. Decode base64 and safely handle multi-byte UTF-8 characters
            const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );

            // 4. Return the parsed JSON object
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Invalid JWT token format", error);
            return null;
        }
    }
}