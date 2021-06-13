let project_list =[
    {
        name:"Stopify",
        description:'A clone of Spotify app with a custom built music player.',
        img_src:"../images/projects/stopify.png",
        link:"https://stopify.netlify.app/"
    },
    {
        name:"Captiongram",
        description:'A image captioning web app that gives the human description of image.',
        img_src:"../images/projects/captiongram.png",
        link:"https://github.com/samiptimalsena/Captiongram"
    },
    {
        name:"IPL Predictor",
        description:'A flask based web app that uses ML model to predict the inning score of IPL team.',
        img_src:"../images/projects/ipl_predictor.png",
        link:"https://my-ipl-predictor.herokuapp.com/"
    },
    {
        name:"Sasto Bazaar",
        description:'An encommerce app made with flutter.',
        img_src:"../images/projects/sasto_bazaar.png",
        link:"https://github.com/samiptimalsena/Sasto_Bazaar"
    },
    {
        name:"Covid Tracker",
        description:"A realtime covid tracking mobile app.",
        img_src:"../images/projects/covid_tracker.png",
        link:"https://github.com/samiptimalsena/Flutter-Covid-Tracker"
    }
]

let ProjectCard=(props)=>{
    return`
        <a href="${props.link}" style="text-decoration:None" target="_blank">
        <div class='projectCard'>
            <div class="imageHolder">
                <img src="${props.img_src}" alt="stopify"/>
            </div>
            <div class='projectDescription'>
                <p1>${props.name}</p1>
                <p>${props.description}</p>
            </div>
        </div>
        </a>`
}


let projects = `
    <div class="projectHolder"> 
        <div class='projectTitle'>
            Project list
        </div>
        <div class='projectCardHolder'>
            ${project_list.map(project => ProjectCard(project)).join('')}
        </div>
    </div>
`
