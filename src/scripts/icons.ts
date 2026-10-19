import { Folder, FileText, FileTerminal, FileUser, SquareTerminal, Globe, Minus, Square, X, ArrowLeft, ArrowRight, RotateCw, ExternalLink, Wifi, Volume2, BatteryFull, Power, MapPin, Users, Star, GitFork, Mail, Lock, Layers, VolumeX, Play, FolderGit2, ChevronLeft, ChevronRight, Palette, Info, RefreshCw } from 'lucide-static';

export const ui = { Folder, FileText, SquareTerminal, Globe, Minus, Square, X, ArrowLeft, ArrowRight, RotateCw, ExternalLink, Wifi, Volume2, BatteryFull, Power, MapPin, Users, Star, GitFork, Mail, Lock, Layers, VolumeX, Play, FolderGit2, ChevronLeft, ChevronRight, Palette, Info, RefreshCw };

export function iconFor(name: string): string {
  if (name.endsWith('.sh')) return FileTerminal;
  if (name.endsWith('.pdf')) return FileUser;
  if (/\.(txt|md)$/.test(name)) return FileText;
  return Folder;
}
