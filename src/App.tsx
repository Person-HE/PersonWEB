import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { WechatModalProvider } from '@/components/WeChatModal';
import { siteConfig } from '@/config/site.config';

// 前台路由级代码分割
const Home = lazy(() => import('@/pages/Home'));
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
const AdminLogs = lazy(() => import('@/pages/admin/AdminLogs'));
const AdminPassword = lazy(() => import('@/pages/admin/AdminPassword'));

import { resourceConfig, toolConfig, serviceConfig } from '@/admin/config';

/** 根据路由设置 document.title */
function useDocumentTitle() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    let title = siteConfig.name;
    if (path === '/') {
      title = `${siteConfig.name} - AI工具导航 / 免费资源 / 技术服务`;
    } else if (path.startsWith('/resources/')) {
      title = `资源详情 - ${siteConfig.name}`;
    } else if (path === '/resources') {
      title = `资源中心 - 免费AI工具和教程下载 | ${siteConfig.name}`;
    } else if (path === '/navigation') {
      title = `AI工具导航 - 收录好用AI工具 | ${siteConfig.name}`;
    } else if (path.startsWith('/services/')) {
      title = `服务详情 - ${siteConfig.name}`;
    } else if (path === '/services') {
      title = `服务中心 - AI技术服务 | ${siteConfig.name}`;
    } else if (path === '/enterprise') {
      title = `企业AI落地服务 | ${siteConfig.name}`;
    } else if (path === '/about') {
      title = `关于 - ${siteConfig.name}`;
    } else if (path.startsWith('/admin')) {
      title = `管理后台 - ${siteConfig.name}`;
    }
    document.title = title;
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
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/about" element={<About />} />
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
