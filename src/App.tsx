import { useEffect, useState } from "react";
import { getAllPoke, getPoke } from "./utils/pokemon";
import { Card } from "./components/Card";
import { PokeArray, PokemonDetails } from "./type";
import { Navvbar } from "./components/Navvbar";

import "./App.css";
import styles from "./components/Button.module.css";

const App: React.FC = () => {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokeData, setPokeData] = useState<PokemonDetails[]>([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokeData = async (): Promise<void> => {
      // すべてのポケモンデータの作成
      const res = await getAllPoke(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPoke(res.results);
      setLoading(false);
      setNextUrl(res.next); //発火したら次のURLを格納
    };
    fetchPokeData();
  }, []);

  //ポケモンの画像などを読み込む
  const loadPoke = async (data: PokeArray): Promise<void> => {
    //20種類のfetchが終わるまで待機
    const _pokeData: PokemonDetails[] = await Promise.all(
      data.map((poke) => {
        const pokeRecord = getPoke(poke.url);
        return pokeRecord;
      })
    );
    setPokeData(_pokeData);
  };

  const handlePrevPage = async (): Promise<void> => {
    console.log(prevUrl);
    if (!prevUrl) return;
    setLoading(true); //読み込んだらtrue
    const data = await getAllPoke(prevUrl); //nextUrlで次のURLを読み込む
    await loadPoke(data.results);
    setNextUrl(data.next); //発火したら次のURLを格納
    setPrevUrl(data.previous); //発火したら前のURLを格納
    window.scrollTo(0, 0);
    setLoading(false); //読み込んだらtrue
  };

  const handleNextPage = async (): Promise<void> => {
    setLoading(true); //読み込んだらtrue
    const data = await getAllPoke(nextUrl); //nextUrlで次のURLを読み込む
    console.log(data.results);
    setNextUrl(data.next); //発火したら次のURLを格納
    setPrevUrl(data.previous); //発火したら前のURLを格納

    await loadPoke(data.results);
    window.scrollTo(0, 0);
    setLoading(false); //読み込んだらtrue
  };
  return (
    <>
      <Navvbar />
      {loading ? (
        <span className="Loading">ローディング中</span>
      ) : (
        <>
          <div className="Card__Contaienr">
            {pokeData.map((poke) => {
              return (
                <div key={poke.id}>
                  <Card poke={poke} id={poke.id} />
                </div>
              );
            })}
          </div>
          <div className={styles.BtnWrapper}>
            {prevUrl && (
              <button className={styles.button} onClick={handlePrevPage}>
                前へ
              </button>
            )}
            <button
              className={`${styles.button} ${!prevUrl && styles.button__right}`}
              onClick={handleNextPage}
            >
              次へ
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default App;
