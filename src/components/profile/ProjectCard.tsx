import React from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="flex flex-col h-full glass-panel overflow-hidden group border border-border/40 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="p-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
        
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
            {project.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
      </div>
      
      <div className="px-6 flex-1">
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 font-medium">
          {project.description}
        </p>

        {/* Project Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/5 dark:bg-white/5 text-foreground/80 border border-foreground/10 group-hover:border-primary/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 mt-6 border-t border-foreground/10 bg-black/5 dark:bg-white/5 flex gap-4 backdrop-blur-sm">
        {project.githubUrl && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold flex items-center text-foreground/80 hover:text-primary transition-colors"
          >
            <Github className="w-4 h-4 mr-1.5" />
            GitHub
          </motion.a>
        )}
        {project.demoUrl && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold flex items-center text-foreground/80 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Live Demo
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};
