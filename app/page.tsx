import Image from "next/image";
import ScrollReveal from "./components/ScrollReveal";
// Copying generated artifact images to be imported securely might be an issue so we'll use placeholder or absolute paths. 
// For production next.js the images need to be in /public or accessible via URL. Let's use external placeholders to mock the look, unless we dynamically load them. 
// I will use some high-quality Unsplash image placeholders to make the mock look stunning.

export default function Home() {
  return (
    <main className="main-container">

      {/* 1. Hero Section */}
      <ScrollReveal direction="up">
        <div className="hero-wrapper">
          {/* We use an aesthetic kitchen placeholder for the background */}
          <Image 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop" 
            alt="Kitchen Background" 
            fill
            className="hero-bg"
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Dobrodošli u Moj Kutak</h1>
            <p className="hero-subtitle">Tvoje mjesto za slatke i slane recepte!</p>
            <button className="btn-golden">Otkrij Recepte 🥄</button>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Recent Recipes */}
      <ScrollReveal direction="left" delay={100}>
        <h2 className="section-title">Svježe iz Moje Kuhinje</h2>
        <div className="card-grid-3">
          
          <div className="card-white">
            <div className="card-img-placeholder">
              <span className="card-trophy">🏆</span>
              <Image src="https://images.unsplash.com/photo-1528207776546-32248a4f104e?q=80&w=800&auto=format&fit=crop" alt="Pancakes" fill style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="card-title">Savršene Palačinke</h3>
            <button className="btn-blue">Pročitaj Recept</button>
          </div>

          <div className="card-white">
            <div className="card-img-placeholder">
              <span className="card-trophy">🏆</span>
              <Image src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop" alt="Veggie Stir Fry" fill style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="card-title">Ukusni Voki-Toki</h3>
            <button className="btn-blue">Pročitaj Recept</button>
          </div>

          <div className="card-white">
            <div className="card-img-placeholder">
              <span className="card-trophy">🏆</span>
              <Image src="https://images.unsplash.com/photo-1519915028121-7d3463d20eb4?q=80&w=800&auto=format&fit=crop" alt="Fruit Tart" fill style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="card-title">Voćna Čarolija</h3>
            <button className="btn-blue">Pročitaj Recept</button>
          </div>

        </div>
      </ScrollReveal>

      {/* 3. YouTube Section */}
      <ScrollReveal direction="right" delay={150}>
        <h2 className="section-title">Najpopularniji Video Recepti na YouTube-u</h2>
        <div className="card-grid-3">
          
          <div className="yt-card">
            <div className="card-img-placeholder yt-thumbnail">
              <Image src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop" alt="Video 1" fill style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
              <div className="yt-play">▶</div>
            </div>
            <h4 className="yt-title">Kako Napraviti Rustikalnu Pizzu</h4>
          </div>

          <div className="yt-card">
            <div className="card-img-placeholder yt-thumbnail">
              <Image src="https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=800&auto=format&fit=crop" alt="Video 2" fill style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
              <div className="yt-play">▶</div>
            </div>
            <h4 className="yt-title">Brzi Doručak za 5 Minuta</h4>
          </div>

          <div className="yt-card">
            <div className="card-img-placeholder yt-thumbnail">
              <Image src="https://images.unsplash.com/photo-1484723091791-0fee59ca0b28?q=80&w=800&auto=format&fit=crop" alt="Video 3" fill style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
              <div className="yt-play">▶</div>
            </div>
            <h4 className="yt-title">Tajna Savršenog Bifteka</h4>
          </div>

        </div>
      </ScrollReveal>

      {/* 4. About Me */}
      <ScrollReveal direction="left" delay={200}>
        <div className="about-section">
          <div className="about-illustration">
             {/* We use an aesthetic placeholder for the chef illustration */}
            <Image 
               src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" 
               alt="Chef Illustration" 
               width={400} 
               height={400} 
               style={{ borderRadius: '50%', border: '8px solid var(--white-bg)', boxShadow: 'var(--shadow-soft)' }} 
            />
          </div>
          <div className="about-text">
            <h3>Pozdrav Svima! 👩‍🍳</h3>
            <p>
              Ja sam kreativno srce iza Mojeg Kutka. Moja ljubav prema kuhanju započela je još u bakinoj kuhinji, gdje sam učila tajne starih recepata i uživala u mirisu svježeg kruha. 
            </p>
            <p>
              Moj Kutak je nastao iz želje da podijelim tu strast s vama, na jedan vedar, veseo i pristupačan način. Vjerujem da je svaki obrok prilika za radost, i moji recepti su dizajnirani da budu jednostavni za pratiti, a opet prepuni okusa i 'cute' estetike!
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 5. Culinary Tools */}
      <ScrollReveal direction="right" delay={150}>
        <h2 className="section-title">Moji Najdraži Kulinarski Alati</h2>
        <div className="card-grid-4">
          
          <div className="card-white">
            <span className="tool-icon">🥄</span>
            <h4 className="tool-title">Drveni set za miješanje</h4>
            <button className="btn-blue" style={{ fontSize: '12px' }}>Pogledaj Alat</button>
          </div>
          
          <div className="card-white">
            <span className="tool-icon">🌪️</span>
            <h4 className="tool-title">High-Speed Blender</h4>
            <button className="btn-blue" style={{ fontSize: '12px' }}>Pogledaj Alat</button>
          </div>
          
          <div className="card-white">
            <span className="tool-icon">🥧</span>
            <h4 className="tool-title">Keramička Posuda</h4>
            <button className="btn-blue" style={{ fontSize: '12px' }}>Pogledaj Alat</button>
          </div>
          
          <div className="card-white">
            <span className="tool-icon">⚖️</span>
            <h4 className="tool-title">Digitalna Vaga</h4>
            <button className="btn-blue" style={{ fontSize: '12px' }}>Pogledaj Alat</button>
          </div>

        </div>
      </ScrollReveal>

      {/* 6. Seasonal Favorites */}
      <ScrollReveal direction="up" delay={100}>
        <h2 className="section-title">Sezonski Kulinarski Favoriti</h2>
        <div className="card-grid-2">
          
          <div className="card-white">
            <div className="card-img-placeholder fav-img">
              <Image src="https://images.unsplash.com/photo-1560180474-e8563fd75bab?q=80&w=1200&auto=format&fit=crop" alt="Strawberry Cake" fill style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="card-title fav-title">Torta od Jagoda i Kreme</h3>
            <button className="btn-blue" style={{ padding: '15px 30px', fontSize: '16px' }}>Pročitaj Recept</button>
          </div>

          <div className="card-white">
            <div className="card-img-placeholder fav-img">
              <Image src="https://images.unsplash.com/photo-1505253668822-42074d58a7c6?q=80&w=1200&auto=format&fit=crop" alt="Summer Salad" fill style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="card-title fav-title">Ljetna Salata s Breskvama i Fetom</h3>
            <button className="btn-blue" style={{ padding: '15px 30px', fontSize: '16px' }}>Pročitaj Recept</button>
          </div>

        </div>
      </ScrollReveal>

    </main>
  );
}
