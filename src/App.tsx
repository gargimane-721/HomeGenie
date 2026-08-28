import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { MaterialsComparisonView } from './components/MaterialsComparisonView';
import { CreateProjectWizard } from './components/CreateProjectWizard';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { Project, User } from './types';
import { api } from './services/api';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'workspace' | 'materials'>('home');

  // Application Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        const [projList, userRes] = await Promise.all([
          api.getProjects(),
          api.getCurrentUser(),
        ]);
        setProjects(projList);
        if (projList.length > 0) {
          setCurrentProject(projList[0]);
        }
        if (userRes.user) {
          setCurrentUser(userRes.user);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleOpenProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (target) {
      setCurrentProject(target);
      setCurrentView('workspace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setCurrentProject(newProject);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (currentProject?.id === projectId) {
        const remaining = projects.filter((p) => p.id !== projectId);
        setCurrentProject(remaining[0] || null);
        if (remaining.length === 0) {
          setCurrentView('home');
        }
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setCurrentProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#D1D5DB] text-[#111827] flex flex-col font-sans selection:bg-[#374151] selection:text-white overflow-x-hidden">
      {/* Interactive & Ambient Animated Celestial Background */}
      <BackgroundAnimation />

      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'wizard') {
            setIsWizardOpen(true);
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onStartNewPlan={() => setIsWizardOpen(true)}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Page Body with spacious container */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-24">
        {currentView === 'home' && (
          <HomePage
            onStartNewProject={() => setIsWizardOpen(true)}
            onExploreProjects={() => setCurrentView('dashboard')}
            onOpenSampleProject={handleOpenProject}
            onNavigate={(v) => {
              if (v === 'wizard') setIsWizardOpen(true);
              else setCurrentView(v);
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            projects={projects}
            onOpenProject={handleOpenProject}
            onCreateNewProject={() => setIsWizardOpen(true)}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {currentView === 'workspace' && currentProject && (
          <WorkspacePage
            project={currentProject}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {currentView === 'materials' && (
          <div className="py-2">
            <MaterialsComparisonView />
          </div>
        )}
      </main>

      {/* Global Architectural Footer */}
      <Footer
        onNavigate={(view) => {
          if (view === 'wizard') setIsWizardOpen(true);
          else setCurrentView(view);
        }}
      />

      {/* Create House Plan Wizard Modal */}
      <CreateProjectWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* User Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
