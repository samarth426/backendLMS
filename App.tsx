/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  BookOpen, 
  Activity, 
  MessageSquare, 
  CreditCard,
  Zap,
  Info,
  User,
  LogIn,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Loader2,
  Cpu,
  BadgeAlert
} from "lucide-react";
import { UserSafe, Course, UserProgress, ViewTab } from "./types";
import Navigation from "./components/Navigation";
import SitemapCatalog from "./components/SitemapCatalog";
import CoursePlayer from "./components/CoursePlayer";
import AiTutor from "./components/AiTutor";
import BillingDashboard from "./components/BillingDashboard";
import AuthInterface from "./components/AuthInterface";

export default function App() {
  const [user, setUser] = useState<UserSafe | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("sixsigma_token"));
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressList, setProgressList] = useState<UserProgress[]>([]);
  
  // Views navigation tab state
  const [activeTab, setActiveTab] = useState<ViewTab>("home");
  
  // Auth popup form modal states
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [authBranch, setAuthBranch] = useState<string>("Electrical");
  const [authTrack, setAuthTrack] = useState<string>("Fresher");

  // Success banners state
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Restores user session context if local token is cached
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  // Dynamically load courses from public database endpoint
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch student course progress logs if logged in
  useEffect(() => {
    if (user && token) {
      fetchProgress(token);
    } else {
      setProgressList([]);
    }
  }, [user, token]);

  const fetchProfile = async (sessionToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response.ok) {
        const profile = await response.json();
        setUser(profile);
      } else {
        // Expired or invalid token, clean cached variables
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const list = await response.json();
        setCourses(list);
      }
    } catch (err) {
      console.error("Failed to load courses metadata from server database REST APIs:", err);
    }
  };

  const fetchProgress = async (sessionToken: string) => {
    try {
      const response = await fetch("/api/user/progress", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response.ok) {
        const logs = await response.json();
        setProgressList(logs);
      }
    } catch (err) {
      console.error("Progress retrieval failure:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sixsigma_token");
    setToken(null);
    setUser(null);
    setProgressList([]);
    setActiveTab("home");
    triggerBanner("Successfully logged out from Sixsigma AI platform.");
  };

  const notifySignupTriggeredFromHome = (branch: string, track: string) => {
    setAuthBranch(branch);
    setAuthTrack(track);
    setAuthMode("signup");
    setIsAuthOpen(true);
  };



  // Triggers visual banner flashes
  const triggerBanner = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  // Triggered when video updates or quizzes complete inside media player module
  const handleProgressCheckpointUpdated = async (
    courseId: string,
    lessonId: string,
    completed: boolean,
    watchPercent: number,
    score?: number
  ) => {
    if (!token) return;
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed,
          watchPercent,
          score,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgressList(data.progress || []);
      }
    } catch (err) {
      console.error("Progress synchronization pipeline failure:", err);
    }
  };

  const handleCheckoutSimulatorSuccess = () => {
    if (token) {
      // Reload profile from backend to register unlocked premium state in navigation rings layout
      fetchProfile(token);
      triggerBanner("💥 Premium unlocked! Welcome to the EV, Embedded & Agentic AI advanced systems syllabus.");
      setActiveTab("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col justify-between">
      
      {/* Top Navigation Frame */}
      <Navigation
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setAuthMode("login");
          setIsAuthOpen(true);
        }}
      />

      {/* Interactive Flash Toast */}
      {successMsg && (
        <div className="bg-[#10b981] text-white py-3 px-4 shadow-xl text-center text-xs font-mono tracking-wide flex items-center justify-center gap-2 animate-fade-in z-45 sticky top-14">
          <CheckCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Container Core Scope */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        {/* Bento Core System Blueprint Header Banner */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#1e293b]/80 border border-[#334155] rounded-2xl p-5 gap-4 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tighter text-white flex items-center gap-2 uppercase">
              SIXSIGMA-LMS <span className="text-sky-400 text-xs md:text-sm font-normal font-mono">/v1.1-stable</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-mono">Architecture Blueprint: Distributed Node.js/Express Core with JWT Web Security</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest font-mono">LMS Engine</span>
                <span className="text-xs text-sky-400 font-bold font-mono flex items-center gap-1.5">
                  <span className="status-dot"></span> Operational
                </span>
              </div>
              <div className="h-6 w-[1.5px] bg-slate-750" />
              <div className="text-right">
                <span className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest font-mono">Response</span>
                <span className="text-xs text-emerald-400 block font-mono font-bold">14ms</span>
              </div>
              <div className="h-6 w-[1.5px] bg-slate-750" />
              <div className="text-right">
                <span className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest font-mono">Secure API</span>
                <span className="text-xs text-[#38bdf8] block font-mono font-bold">SSL: ON</span>
              </div>
            </div>
            
            <div className="text-xs bg-[#0f172a] text-sky-400 px-3 py-2 border border-[#334155] rounded-xl font-mono text-center">
              Active Port: <span className="text-white font-bold">3000</span>
            </div>
          </div>
        </header>
        
        {/* Dynamic Navigation Tabs mounting pages */}
        {activeTab === "home" && (
          <SitemapCatalog
            onSignupRequested={notifySignupTriggeredFromHome}
            isLoggedIn={!!user}
          />
        )}

        {activeTab === "syllabus" && (
          <SitemapCatalog
            onSignupRequested={notifySignupTriggeredFromHome}
            isLoggedIn={!!user}
          />
        )}

        {activeTab === "dashboard" && user && (
          <div className="space-y-6">
            <div className="border-b border-[#222936] pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-1.5 tracking-tight">
                🎓 Candidate LMS Classroom Dashboard
              </h2>
              <p className="text-xs text-[#8a99ad] font-mono mt-0.5">
                Logged in as <strong className="text-white">{user.name}</strong>  │  Syllabus Track: <strong className="text-[#fbbf24]">{user.track}</strong>  │  Engineering Domain: <strong className="text-[#3b82f6]">{user.branch}</strong>
              </p>
            </div>

            <CoursePlayer
              user={user}
              courses={courses}
              progressList={progressList}
              onProgressUpdated={handleProgressCheckpointUpdated}
              token={token}
            />
          </div>
        )}

        {/* AI Tutor Page */}
        {activeTab === "ai-tutor" && user && (
          <div className="space-y-6">
            <div className="border-b border-[#222936] pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                🤖 24/7 Academic Mentor & Placement AI Coach
              </h2>
              <p className="text-xs text-[#8a99ad] font-mono mt-0.5">
                Formulate doubts on {user.branch} calculations or Six Sigma Green Belt DMAIC process guidelines
              </p>
            </div>

            <AiTutor user={user} token={token} />
          </div>
        )}

        {/* Pricing/Billing Dashboard Page */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="border-b border-[#222936] pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                💳 Stripe Billing Subscriptions Hub
              </h2>
              <p className="text-xs text-[#8a99ad] font-mono mt-0.5">
                Review payment statuses, create Stripe Checkout sessions, and test Webhook event loops
              </p>
            </div>

            <BillingDashboard
              user={user}
              onPaymentSuccessSimulated={handleCheckoutSimulatorSuccess}
              token={token}
              onOpenAuth={() => {
                setAuthMode("signup");
                setIsAuthOpen(true);
              }}
            />
          </div>
        )}

      </main>

      {/* Interactive Modal overlay for Sign up & Sign In */}
      <AuthInterface
        key={`${authMode}-${isAuthOpen}`}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        initialBranch={authBranch}
        initialTrack={authTrack}
        onAuthSuccess={(sessionToken, sessionUser) => {
          setToken(sessionToken);
          setUser(sessionUser);
          setIsAuthOpen(false);
          triggerBanner("Authentication successful. Welcome to your PG Classroom!");
          setActiveTab("dashboard");
        }}
      />

      {/* Corporate Footnote Frame - Upgrade to Bento Footer */}
      <footer className="bg-[#1e293b] border-t border-[#334155] px-6 py-6 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex flex-col items-start space-y-1">
          <p className="text-white font-mono text-[10px] font-bold tracking-widest uppercase flex items-center">
            <span className="status-dot mr-2"></span>
            SIXSIGMA AI INSTITUTE │ CLUSTER A-1 ACTIVE
          </p>
          <p className="text-[#94a3b8] leading-normal max-w-xl text-[11px]">
            ISO 50001, Lean Black Belt & Moodle Standardized. Real-time API endpoints orchestrated with JWT authorization persistence.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-[#020617] text-[#94a3b8] border border-[#334155] rounded text-[10px] font-mono">PORT: 3000</span>
          <span className="px-2.5 py-1 bg-[#020617] text-[#94a3b8] border border-[#334155] rounded text-[10px] font-mono">DB_POOL: 25</span>
          <span className="px-2.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-400/20 rounded text-[10px] font-mono font-bold">SSL: COMPLIANT</span>
        </div>
      </footer>

    </div>
  );
}
