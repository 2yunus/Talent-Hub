# TalentHub Frontend

A modern, responsive job platform built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Beautiful, professional design with smooth animations
- **Responsive Design**: Works perfectly on all devices and screen sizes
- **Authentication System**: Complete login/registration with role-based access
- **Job Management**: Post jobs, browse listings, and manage applications
- **User Profiles**: Comprehensive user profiles for both developers and employers
- **Real-time Updates**: Smooth state management with React Context
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Context API
- **Forms**: React Hook Form (planned)
- **Animations**: CSS Keyframes + Tailwind Transitions

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Homepage
│   ├── login/             # Authentication pages
│   ├── register/
│   ├── dashboard/         # User dashboard
│   ├── profile/           # User profile management
│   ├── jobs/              # Job browsing
│   ├── post-job/          # Job posting
│   └── applications/      # Application management
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   └── ui/               # UI components
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state
├── styles/               # Global styles
│   └── globals.css       # Tailwind + custom styles
└── types/                # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Accent**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Components
- **Buttons**: Primary, Secondary, Outline variants
- **Forms**: Input groups, validation states
- **Cards**: Hover effects, shadows
- **Navigation**: Responsive sidebar and top nav

### Animations
- **Entrance**: Fade in, slide up, scale in
- **Hover**: Subtle transforms, color transitions
- **Loading**: Spinners, skeletons
- **Micro-interactions**: Button states, form feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=TalentHub
```

### Tailwind Config
Custom colors, animations, and responsive breakpoints are configured in `tailwind.config.js`.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences

## 🎯 Performance

- Image optimization with Next.js
- Code splitting and lazy loading
- Optimized bundle sizes
- Efficient re-renders with React.memo
- CSS-in-JS optimization

## 🔒 Security

- Input validation and sanitization
- XSS protection
- CSRF token handling
- Secure authentication flow
- Environment variable protection

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## 📦 Build Output

The build process generates:
- Optimized JavaScript bundles
- Static assets with hashed names
- Service worker for PWA features
- Sitemap and robots.txt

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Analytics

- Performance monitoring
- User behavior tracking
- Error reporting
- Conversion analytics

## 🔄 State Management

- **AuthContext**: User authentication state
- **Local State**: Component-level state with useState
- **Form State**: Controlled inputs with validation
- **Global State**: Shared data across components

## 🎨 Customization

### Themes
- Light/dark mode support
- Custom color schemes
- Brand customization
- Component variants

### Styling
- CSS custom properties
- Tailwind utility classes
- Component-specific styles
- Responsive design utilities

## 📚 Documentation

- Component API reference
- Styling guidelines
- Animation patterns
- Best practices
- Code examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

Built with ❤️ by the TalentHub team
