console.log("email writer extension is working ")
function CreateButton(){
const button=document.createElement('div');
button.className='T-I J-J5-Ji aoO v7 T-I-atl L3';
button.style.marginRight="8px";
button.innerHTML="Ai Reply";
button.setAttribute('role','button');
button.setAttribute('data-tooltip','Generate Ai Reply');
return button;

}
function findComposeToolbar(){
const selector=['.btC','.sDh','[role="toolbar"]','.gU.Up']
for(const tool of selector){
    const toolbar=document.querySelector(tool);
    if(toolbar){
        return toolbar;
    }
    return null;
}
}
function getEmailContent(){
const selector=['.h7','.a3s.aiL','.gmail_quote','[role="presentation"]']
for(const slec of selector){
    const content=document.querySelector(slec);
    if(content){
        return content.innerText.trim();
    }
    return '';
}
}
function injectButton(){
    const existingButton=document.querySelector('.ai-reply-btn');
    if(existingButton) existingButton.remove();
    const toolbar=findComposeToolbar();
    if(toolbar){
 console.log("toolbar detected");
 const button=CreateButton();  
 button.classList.add('ai-reply-btn');

button.addEventListener('click',async()=>{

    try {
        button.innerHTML='Generating...';
        button.disabled=true;
        const emailContent=getEmailContent();
       const res= await fetch('http://localhost:9090/api/email/generate',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                 emailContent: emailContent, 
                tone: "professional",
            })
        });
        if(!res.ok){
            throw new Error ("Api request Failed");
        }
       const generatedReply= await res.text();
       const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

       if(composeBox){
        composeBox.focus();
        document.execCommand('insertText',false,generatedReply);
       }else{
            console.error('compose box was not found');
        }
    } catch (error) {
        console.log(error);
        alert("failed to generate reply");
    }finally{
        button.innerHTML="Ai Reply";
        button.disabled=false;
    }

});
toolbar.insertBefore(button,toolbar.firstChild);
}
}
const observer =new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes=Array.from(mutation.addedNodes);
        const hasComposeElement=addedNodes.some(node=>node.nodeType==Node.ELEMENT_NODE && (node.matches('.aDh,.btc,[role="dialog"]') || node.querySelector('.aDh,.btc,[role="dialog"]')));
        if(hasComposeElement){
            console.log("compose window detected");
            setTimeout(injectButton,500);
        }
    }
});
observer.observe(document.body,{
    childList:true,
    subtree:true
}
);