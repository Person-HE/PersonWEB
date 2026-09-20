import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import SiteEffects from '@/components/SiteEffects';
import { WechatModalProvider } from '@/components/WeChatModal';
import { siteConfig } from '@/config/site.config';

// 前台路由级代码分割
const Home = lazy(() => import('@/pages/Home'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const PortfolioDetail = lazy(() => import('@/pages/PortfolioDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const Contact = lazy(() => import('@/pages/Contact'));
const Resources = lazy(() => import('@/pages/Resources'));
const ResourceDetail = lazy(() => import('@/pages/ResourceDetail'));
const Navigation = lazy(() => import('@/pages/Navigation'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Enterprise = lazy(() => import('@/pages/Enterprise'));
const About = lazy(() => import('@/pages/About'));

// 后台路由
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminCrudPage = lazy(() => import('@/pages/admin/AdminCrudPage'));
const AdminProfile = lazy(() => import('@/pages/admin/AdminProfile'));
const AdminLogs = lazy(() => import('@/pages/admin/AdminLogs'));
const AdminPassword = lazy(() => import('@/pages/admin/AdminPassword'));

import { resourceConfig, toolConfig, serviceConfig, portfolioConfig, quoteConfig } from '@/admin/config';

/** 各页面标题由 <Seo> 组件设置；此处只兜底后台与未接入页 */
function useDocumentTitle() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.title = `管理后台 - ${siteConfig.name}`;
    }
  }, [location.pathname]);
}

function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 pt-16">
      <div className="text-sm text-slate-500">加载中...</div>
    </div>
  );
}

function FrontRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function AdminRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route
            path="resources"
            element={<AdminCrudPage config={resourceConfig} apiBase="/api/resources" />}
          />
          <Route
            path="tools"
            element={<AdminCrudPage config={toolConfig} apiBase="/api/tools" />}
          />
          <Route
            path="services"
            element={<AdminCrudPage config={serviceConfig} apiBase="/api/services" />}
          />
          <Route
            path="portfolio"
            element={<AdminCrudPage config={portfolioConfig} apiBase="/api/portfolio" />}
          />
          <Route
            path="quotes"
            element={<AdminCrudPage config={quoteConfig} apiBase="/api/quote" />}
          />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="password" element={<AdminPassword />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function AppRoutes() {
  useDocumentTitle();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminRoutes />;
  }

  return (
    <>
      <SiteEffects />
      <Navbar />
      <FrontRoutes />
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <WechatModalProvider>
        <AppRoutes />
      </WechatModalProvider>
    </Router>
  );
}
