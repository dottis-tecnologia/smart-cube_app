# Cube4Meters - Smart Cube QR Code

Mobile app for collecting energy meter readings through QR Code, developed by Smart Cube.

## 📱 Description

Cube4Meters is a mobile solution for energy consumption reading management, allowing:

- QR Code meter reading
- Local offline storage
- Automatic server synchronization
- Consumption data management
- Multi-language support

## 🛠 Tech Stack

- **Framework**: React Native + Expo SDK 49
- **Language**: TypeScript 5
- **UI**: NativeBase 3
- **Navigation**: React Navigation
- **Local State**: Expo SQLite
- **Communication**: tRPC Client + SuperJSON
- **Internationalization**: i18next
- **Authentication**: JWT + Expo Secure Store

## 📋 Prerequisites

- Node.js 18+
- Yarn 1.22+
- Expo CLI
- Configured Expo account

## 🚀 Installation and Development

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-cube-qrcode/smart-cube_app
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start development:
```bash
# For local development
yarn start

# For Android
yarn android

# For iOS
yarn ios
```

## 📱 Build and Deploy

### Development
```bash
# Development build
eas build --profile development
```

### Staging
```bash
# Staging build
eas build --profile staging
```

### Production
```bash
# Production build for Android
eas build --profile production --platform android

# Production build for iOS
eas build --profile production --platform ios
```

## 🔧 Configuration

### Environment Variables

- `EXPO_PUBLIC_API_URL`: Backend API URL
- `EXPO_PUBLIC_STAGING`: Staging environment flag

### Build Profiles

- **development**: Development client, APK
- **preview**: Internal build for testing
- **staging**: Homologation environment
- **production**: Final build for stores

## 📁 Project Structure

```
smart-cube_app/
├── components/          # React Native components
│   ├── CreateReading/ # Reading components
│   ├── shared/        # Shared components
│   └── util/          # UI utilities
├── screens/           # App screens
│   ├── NoAuth/        # No-auth screens
│   └── Tabs/          # Tab navigation screens
├── hooks/             # Custom hooks
├── util/              # General utilities
│   ├── sync/          # Sync logic
│   └── db.ts          # SQLite configuration
├── locales/           # Translation files
├── assets/            # Images and icons
└── config.ts          # General configuration
```

## 🔐 Security

- JWT tokens stored in SecureStore
- Sensitive data encryption
- Client and server input validation
- Privacy policy compliance

## 📊 Main Flow

1. **Login**: Email/password authentication
2. **Home**: Dashboard with user information
3. **Scan QR**: QR Code reading from meters
4. **Create Reading**: Reading registration with photo
5. **Sync**: Automatic data synchronization

## 🌐 Internationalization

The app supports multiple languages through i18next:
- English - default
- Portuguese (Brazil)
- Spanish

## 📱 Permissions

### Android
- `CAMERA`: Camera access for QR Code
- `RECORD_AUDIO`: Audio recording (future)

### iOS
- Camera access
- Local storage access

## 🧪 Tests

```bash
# To run tests (when implemented)
yarn test
```

## 📝 Privacy Policy

Our privacy policy is available at:
[privacy-policy-en.html](./privacy-policy-en.html)

## 📋 Terms of Service

The app terms of service are available at:
[terms-of-service-en.html](./terms-of-service-en.html)

## 🚀 Publication

### Google Play Store
- Package: `com.dottis.smartcube`
- Data Safety configured
- Privacy policy available

### Apple App Store
- iOS configurations optimized
- Complete metadata
- Screenshots prepared

## 📞 Support

- **Email**: contact@smartcube.lu
- **Company**: Smart Cube
- **Version**: 1.2.0

## 📄 License

All rights reserved © 2026 Smart Cube

---

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler failed**: Clear cache with `expo start -c`
2. **Build failed**: Check environment variables
3. **QR Code not reading**: Check camera permissions

### Useful Commands

```bash
# Clear cache
expo start -c

# Check Expo version
expo --version

# List devices
expo install --fix

# Clear node_modules
rm -rf node_modules && yarn install
```

---

For more information, contact the development team.
