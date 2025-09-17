import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert, type ServiceAccount } from 'firebase-admin/app';

const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}

export function getAdminApp() {
    if (getAdminApps().length > 0) {
        return getAdminApps()[0]!;
    }
    return initializeAdminApp({
        credential: cert(serviceAccount)
    });
}
