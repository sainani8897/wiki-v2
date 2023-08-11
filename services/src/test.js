 function  test(){
    for (let i = 0; i < 10; i++) {
        await setInterval(() => {
            console.log(i);
        }, 1000);
        
    }
}

test();