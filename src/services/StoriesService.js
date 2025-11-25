import { supabase } from '../config/supabase';
export class StoriesService {
  static async getStories() {
    const { data, error } = await supabase.from('stories').select('*');
    if (error) throw error;
    return data;
  }
  static async crearStory(story) {
    const { data, error } = await supabase.from('stories').insert([story]);
    if (error) throw error;
    return data;
  }
}
