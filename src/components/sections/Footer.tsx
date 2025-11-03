import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';

/**
 * Footer Component - Contact form and social links
 * Follows Single Responsibility Principle
 */
function Footer() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be added later
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { name: 'Discord', href: '#', icon: '💬' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'GitHub', href: '#', icon: '💻' },
  ];

  return (
    <footer id="contact" className="bg-bolf-black border-t border-bolf-gray/10 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-bolf-white">{t('footer.contact')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t('footer.email')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bolf-black border border-bolf-gray/20 rounded-lg text-bolf-white placeholder-bolf-gray focus:outline-none focus:border-bolf-neon-blue transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder={t('footer.subject')}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bolf-black border border-bolf-gray/20 rounded-lg text-bolf-white placeholder-bolf-gray focus:outline-none focus:border-bolf-neon-blue transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder={t('footer.message')}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-bolf-black border border-bolf-gray/20 rounded-lg text-bolf-white placeholder-bolf-gray focus:outline-none focus:border-bolf-neon-blue transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-bolf-neon-blue hover:bg-bolf-neon-blue/80 text-bolf-white font-semibold rounded-lg transition-colors"
              >
                {t('footer.send')}
              </button>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold mb-6 text-bolf-white">{t('footer.socialMedia')}</h3>
            <div className="space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-4 text-bolf-gray hover:text-bolf-neon-blue transition-colors"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-lg">{link.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-bolf-gray/10 pt-8 text-center text-bolf-gray space-y-4">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          
          {/* Attributions */}
          <div className="mt-8 pt-8 border-t border-bolf-gray/10">
            <h4 className="text-sm font-semibold text-bolf-white mb-4">Attributions</h4>
            <div className="text-xs space-y-2 text-bolf-gray/80">
              <p className="mb-3">
                This project uses open-source components under MIT License for non-commercial purposes.
              </p>
              
              <div className="space-y-2">
                <p>
                  <strong>BOLF Keyboard:</strong>{' '}
                  <a 
                    href="https://codepen.io/jh3y/pen/OPyPRLK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-bolf-neon-blue hover:text-bolf-orange transition-colors"
                  >
                    CodePen
                  </a>
                  {' '}by{' '}
                  <a 
                    href="https://codepen.io/jh3y" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-bolf-neon-blue hover:text-bolf-orange transition-colors"
                  >
                    Jhey
                  </a>
                  {' '}(MIT License)
                </p>
                
                <p>
                  <strong>Tubes Cursor:</strong>{' '}
                  <a 
                    href="https://codepen.io/soju22/pen/qEbdVjK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-bolf-neon-blue hover:text-bolf-orange transition-colors"
                  >
                    CodePen
                  </a>
                  {' '}by{' '}
                  <a 
                    href="https://codepen.io/soju22" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-bolf-neon-blue hover:text-bolf-orange transition-colors"
                  >
                    Kevin Levron (soju22)
                  </a>
                  {' '}(MIT License)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

