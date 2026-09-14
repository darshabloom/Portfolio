const projectData={studdy:{label:"BUILDING / FULL-STACK",title:"Studdy",intro:"A tutoring platform designed around the workflows tutors, students and parents actually need.",sections:[["The problem","Tutoring can become fragmented across bookings, messages, files, lesson notes and homework. Studdy brings those pieces into one clearer experience."],["What I’m building","Tutor profiles, booking and recurring lessons, lesson summaries, homework, resources, student/parent views and tutor workflows."],["My approach","I’m designing the product around how tutoring already happens. The portfolio demo uses sample data so people can explore the experience safely."],["What I’m learning","Full-stack development, system design, database decisions, interaction design, privacy and the trade-offs that appear once a project grows beyond a simple website."]],actions:[["View demo","#"],["GitHub","#"]]},currency:{label:"JAVA / ALGORITHMS",title:"Currency Exchange",intro:"A graph-based Java project that analyses conversion paths and detects arbitrage opportunities.",sections:[["Technical focus","Currencies are represented as vertices and exchange rates as weighted edges. Bellman–Ford is used after a logarithmic transformation to detect profitable negative cycles."],["Why I included it","It shows a different side of my work: algorithmic problem solving rather than interface design."]],actions:[["GitHub","#"]]},snowwoman:{label:"COMPUTER GRAPHICS",title:"Snowwoman",intro:"A 2D graphics project where code became the medium for building a visual scene.",sections:[["What I explored","2D drawing, composition and graphics-programming concepts through a visual project."],["Why I included it","I enjoy projects where technical work and creativity overlap, and this one makes that visible quickly."]],actions:[["GitHub","#"]]},matryoshka:{label:"SHIPPED / WEB",title:"Matryoshka",intro:"A live web project I designed and built for real use.",sections:[["What it was","A working site built around a real ordering experience."],["What changed when it went live","Clarity mattered more, edge cases appeared quickly, and design decisions had consequences for real people using the site."],["Current status","Ordering is closed. I’m preserving a non-transactional version as an interactive portfolio demo."]],actions:[["View archived demo","#"],["GitHub","#"]]},unios:{label:"IN PROGRESS",title:"UniOS",intro:"An ongoing software project that is still being shaped.",sections:[["Current status","The project is under active development. I’m keeping this section honest about what exists now and what is still evolving."],["Why show unfinished work?","Because iteration is part of the work. This project shows some of the decisions, experiments and changes that happen before a finished product exists."]],actions:[["GitHub","#"]]}};

document.querySelectorAll("[data-carousel]").forEach(carousel=>{const slides=[...carousel.querySelectorAll(".slide")],prev=carousel.querySelector(".prev"),next=carousel.querySelector(".next"),dots=carousel.querySelector(".carousel-dots");let index=0,timer;slides.forEach((_,i)=>{const dot=document.createElement("button");if(i===0)dot.classList.add("active");dot.addEventListener("click",e=>{e.stopPropagation();show(i);restart()});dots.appendChild(dot)});const dotButtons=[...dots.querySelectorAll("button")];function show(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===index));dotButtons.forEach((d,i)=>d.classList.toggle("active",i===index))}function restart(){clearInterval(timer);timer=setInterval(()=>show(index+1),4200)}prev.addEventListener("click",e=>{e.stopPropagation();show(index-1);restart()});next.addEventListener("click",e=>{e.stopPropagation();show(index+1);restart()});carousel.addEventListener("mouseenter",()=>clearInterval(timer));carousel.addEventListener("mouseleave",restart);restart()});

const dialog=document.getElementById("projectDialog"),dialogContent=dialog.querySelector(".dialog-content");function openProject(key){const p=projectData[key];if(!p)return;dialogContent.innerHTML=`<p class="mini-label">${p.label}</p><h2>${p.title}</h2><p>${p.intro}</p>${p.sections.map(([h,c])=>`<section><h3>${h}</h3><p>${c}</p></section>`).join("")}<div class="dialog-actions">${p.actions.map(([l,h],i)=>`<a href="${h}" ${h==="#"?'data-placeholder-link':''} class="${i?'secondary':''}">${l} ↗</a>`).join("")}</div>`;dialog.showModal()}document.querySelectorAll(".project").forEach(card=>{
  const key=card.dataset.project;

  card.querySelectorAll(".project-link").forEach(button=>{
    button.addEventListener("click",(e)=>{
      e.stopPropagation();
      openProject(key);
    });
  });

  card.addEventListener("click",(e)=>{
    if (e.target.closest(".carousel-btn, .carousel-dots, a, button")) return;
    openProject(key);
  });

  card.setAttribute("tabindex","0");
  card.setAttribute("role","button");
  card.setAttribute("aria-label",`Open ${projectData[key]?.title || "project"}`);

  card.addEventListener("keydown",(e)=>{
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProject(key);
    }
  });
});dialog.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());document.addEventListener("click",e=>{const p=e.target.closest("[data-placeholder-link]");if(!p)return;e.preventDefault();alert("Replace this placeholder with your real link before publishing.")});
