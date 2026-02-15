import Image from "next/image";

export default function Home() {
  return (
    <main className="main">
      <div className="prviBlock" >
        <div className="text-content">
          <h1 className="dobrodoslica">Dobrodošli u Moj Kutak</h1>
          <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. </p>
        </div>
        <Image src="/ruzice.jpg"
          width={120}
          height={120}
          className="ruzice"
          alt="Ruzice"
        />
      </div>

      <div className="posts-container">

        {/* Featured Post */}
        <div className="featured-post">
          <div className="featured-text">
            <span className="featured-badge">Izdvojeno</span>
            <h2>Naslov Izdvojene Objave</h2>
            <p>Ovo je kratki opis izdvojene objave. Ovdje mozes napisati o cemu se radi, zasto je vazno ili bilo sta drugo sto zelis istaknuti. Tekst je na lijevoj strani.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <button className="read-more-btn">Procitaj vise</button>
          </div>
          <div className="featured-image-placeholder"></div>
        </div>

        <h2 className="posts-heading">Najnovije Objave</h2>
        <div className="posts-grid">
          {/* Post 1 */}
          <div className="post-card">
            <div className="post-image-placeholder"></div>
            <h3>Naslov Objave 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          {/* Post 2 */}
          <div className="post-card">
            <div className="post-image-placeholder"></div>
            <h3>Naslov Objave 2</h3>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          {/* Post 3 */}
          <div className="post-card">
            <div className="post-image-placeholder"></div>
            <h3>Naslov Objave 3</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
          {/* Post 4 */}
          <div className="post-card">
            <div className="post-image-placeholder"></div>
            <h3>Naslov Objave 4</h3>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          {/* Post 5 */}
          <div className="post-card">
            <div className="post-image-placeholder"></div>
            <h3>Naslov Objave 5</h3>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
          </div>
          {/* Post 6 */}
          <div className="post-card">
            <div className="post-image-placeholder"></div>
            <h3>Naslov Objave 6</h3>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
