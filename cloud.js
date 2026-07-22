'use strict';

const cloud = (() => {
  const configured =
    typeof window.SUPABASE_URL === 'string' &&
    typeof window.SUPABASE_ANON_KEY === 'string' &&
    window.SUPABASE_URL.startsWith('http') &&
    !window.SUPABASE_URL.includes('SUA_URL_AQUI') &&
    !window.SUPABASE_ANON_KEY.includes('SUA_CHAVE_AQUI');

  let client = null;
  if (configured) {
    try {
      client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn('Não foi possível iniciar o Supabase (biblioteca não carregou?):', err);
      client = null;
    }
  }

  let currentUser = null;
  let authChangeHandlers = [];

  function notifyAuthChange(user) {
    currentUser = user;
    authChangeHandlers.forEach(fn => fn(user));
  }

  return {
    enabled: !!client,

    onAuthChange(fn) { authChangeHandlers.push(fn); },

    getUser() { return currentUser; },

    async init() {
      if (!client) return null;
      const { data: { session } } = await client.auth.getSession();
      currentUser = session ? session.user : null;
      client.auth.onAuthStateChange((_event, session) => {
        notifyAuthChange(session ? session.user : null);
      });
      return currentUser;
    },

    async signUp(email, password, username) {
      if (!client) return { error: 'Supabase não configurado.' };
      const { data, error } = await client.auth.signUp({
        email, password,
        options: { data: { username } },
      });
      if (error) return { error: translateAuthError(error) };
      // Se a confirmação por e-mail estiver desativada no projeto,
      // já vem sessão ativa aqui; senão o usuário precisa confirmar o e-mail.
      if (data.session) notifyAuthChange(data.user);
      return { data, needsEmailConfirmation: !data.session };
    },

    async signIn(email, password) {
      if (!client) return { error: 'Supabase não configurado.' };
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { error: translateAuthError(error) };
      notifyAuthChange(data.user);
      return { data };
    },

    async signOut() {
      if (!client) return;
      await client.auth.signOut();
      notifyAuthChange(null);
    },

    async resetPassword(email) {
      if (!client) return { error: 'Supabase não configurado.' };
      const { error } = await client.auth.resetPasswordForEmail(email);
      if (error) return { error: translateAuthError(error) };
      return { ok: true };
    },

    /* ---------------- salvamento de partida ---------------- */
    async saveGame(stateSnapshot) {
      if (!client || !currentUser) return;
      await client.from('game_saves').upsert({
        user_id: currentUser.id,
        state: stateSnapshot,
        updated_at: new Date().toISOString(),
      });
    },

    async loadGame() {
      if (!client || !currentUser) return null;
      const { data, error } = await client
        .from('game_saves')
        .select('state, updated_at')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      if (error || !data) return null;
      return data.state;
    },

    async clearGame() {
      if (!client || !currentUser) return;
      await client.from('game_saves').delete().eq('user_id', currentUser.id);
    },

    /* ---------------- estatísticas ---------------- */
    async saveStats(stats) {
      if (!client || !currentUser) return;
      await client.from('game_stats').upsert({
        user_id: currentUser.id,
        games_played: stats.played,
        games_solved: stats.solved,
        best_time: stats.bestTime,
        updated_at: new Date().toISOString(),
      });
    },

    async loadStats() {
      if (!client || !currentUser) return null;
      const { data, error } = await client
        .from('game_stats')
        .select('games_played, games_solved, best_time')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      if (error || !data) return null;
      return { played: data.games_played, solved: data.games_solved, bestTime: data.best_time };
    },

    async logCompletedGame(difficultyLabel, seconds) {
      if (!client || !currentUser) return;
      await client.from('game_history').insert({
        user_id: currentUser.id,
        difficulty: difficultyLabel,
        seconds,
      });
    },

    /* ---------------- preferências ---------------- */
    async saveSettings(settings) {
      if (!client || !currentUser) return;
      await client.from('profiles')
        .update({ settings })
        .eq('id', currentUser.id);
    },

    async loadProfile() {
      if (!client || !currentUser) return null;
      const { data, error } = await client
        .from('profiles')
        .select('username, settings')
        .eq('id', currentUser.id)
        .maybeSingle();
      if (error || !data) return null;
      return data;
    },
  };
})();

function translateAuthError(error) {
  const msg = (error && error.message) || '';
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('User already registered')) return 'Já existe uma conta com este e-mail.';
  if (msg.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (msg.includes('Unable to validate email address')) return 'E-mail inválido.';
  if (msg.includes('For security purposes')) return 'Aguarde um instante antes de tentar de novo.';
  return msg || 'Algo deu errado. Tente novamente.';
}
