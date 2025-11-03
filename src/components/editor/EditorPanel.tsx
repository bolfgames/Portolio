import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Image as ImageIcon, Plus, Save, Trash2 } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { dataService } from '../../services/dataService';
import type { TeamMember } from '../../models/types';
import AvatarEditor from './AvatarEditor';

interface EditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Editor Panel - Content management panel for team members and projects
 * Follows Single Responsibility Principle
 */
function EditorPanel({ isOpen, onClose }: EditorPanelProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [isEditorModeEnabled, setIsEditorModeEnabled] = useState(false);

  useEffect(() => {
    setIsEditorModeEnabled(settingsService.isEditorModeEnabled());
    loadMembers();
  }, []);

  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      setIsEditorModeEnabled(settingsService.isEditorModeEnabled());
    });
    return unsubscribe;
  }, []);

  const loadMembers = () => {
    const allMembers = dataService.getAllTeamMembers();
    setMembers(allMembers);
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleEditAvatar = (member: TeamMember) => {
    setSelectedMember(member);
    setIsAvatarEditorOpen(true);
  };

  const handleSaveAvatar = (memberId: number, cropData: any) => {
    // TODO: Save avatar crop data to team.json
    console.log('Save avatar crop:', memberId, cropData);
    loadMembers();
    setIsAvatarEditorOpen(false);
    setSelectedMember(null);
  };

  const handleAddMember = () => {
    // TODO: Add new member
    console.log('Add new member');
  };

  const handleDeleteMember = (memberId: number) => {
    // TODO: Delete member
    console.log('Delete member:', memberId);
    loadMembers();
  };

  if (!isEditorModeEnabled) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bolf-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-4xl bg-bolf-black border-l border-bolf-white/10 shadow-2xl z-[101] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-bolf-black/95 backdrop-blur-md border-b border-bolf-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-bolf-orange" />
                <h2 className="text-2xl font-bold text-bolf-white">Editor Panel</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bolf-white/10 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X className="w-6 h-6 text-bolf-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Team Members Section */}
              <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-bolf-orange">Takım Üyeleri</h3>
                  <button
                    onClick={handleAddMember}
                    className="flex items-center space-x-2 px-4 py-2 bg-bolf-neon-blue hover:bg-bolf-neon-blue/80 text-bolf-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Üye Ekle</span>
                  </button>
                </div>

                {/* Members List */}
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4 p-4 bg-bolf-black/50 rounded-lg border border-bolf-white/5 hover:border-bolf-white/20 transition-colors cursor-pointer"
                      onClick={() => handleMemberClick(member)}
                    >
                      {/* Avatar */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAvatar(member);
                          }}
                          className="absolute inset-0 bg-bolf-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <ImageIcon className="w-5 h-5 text-bolf-white" />
                        </button>
                      </div>

                      {/* Member Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-bolf-white font-semibold truncate">{member.name}</h4>
                        <p className="text-bolf-gray text-sm truncate">{member.role}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAvatar(member);
                          }}
                          className="p-2 hover:bg-bolf-white/10 rounded-lg transition-colors"
                          title="Avatar Düzenle"
                        >
                          <ImageIcon className="w-4 h-4 text-bolf-neon-blue" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMember(member.id);
                          }}
                          className="p-2 hover:bg-bolf-white/10 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4 text-bolf-orange" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Avatar Editor Modal */}
          {isAvatarEditorOpen && selectedMember && (
            <AvatarEditor
              member={selectedMember}
              onSave={(cropData) => handleSaveAvatar(selectedMember.id, cropData)}
              onClose={() => {
                setIsAvatarEditorOpen(false);
                setSelectedMember(null);
              }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export default EditorPanel;

