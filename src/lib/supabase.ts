import { createClient } from "@supabase/supabase-js";
import { RankingEntry, GameResult } from "@/types/mahjong";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// スコアを保存
export async function saveScore(
  playerName: string,
  result: GameResult
): Promise<{ data: RankingEntry | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("scores")
    .insert({
      player_name: playerName,
      correct_count: result.correctCount,
      total_answered: result.totalAnswered,
      accuracy: result.accuracy,
      score: result.score,
    })
    .select()
    .single();

  if (error) return { data: null, error: new Error(error.message) };
  return { data: rowToRanking(data), error: null };
}

// ランキング取得（上位50件）
export async function fetchRanking(
  period: "all" | "week" = "all"
): Promise<RankingEntry[]> {
  let query = supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(50);

  if (period === "week") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte("created_at", weekAgo.toISOString());
  }

  const { data } = await query;
  return (data || []).map(rowToRanking);
}

// 自分のランキング順位取得
export async function fetchMyRank(score: number): Promise<number> {
  const { count } = await supabase
    .from("scores")
    .select("*", { count: "exact", head: true })
    .gt("score", score);
  return (count || 0) + 1;
}

function rowToRanking(row: Record<string, unknown>): RankingEntry {
  return {
    id: row.id as string,
    playerName: row.player_name as string,
    correctCount: row.correct_count as number,
    totalAnswered: row.total_answered as number,
    accuracy: row.accuracy as number,
    score: row.score as number,
    createdAt: row.created_at as string,
  };
}
