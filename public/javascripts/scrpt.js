function addMember(member,grupId,grup,payment,maxAmount,totalamount,payable){
    payment=parseInt(payment)
    totalamount=parseInt(totalamount)
    maxAmount=parseInt(maxAmount)
    payable=parseInt(payable)
    if(payment+totalamount <=maxAmount){
        $.ajax({
            url:'/admin/add-this',
            data:{
                memberID:member,
                grup:grup,
                grupId:grupId,
                payment:payment,
                maxamount:maxAmount,
                payable:payable
            },
            method:'post',
            success:(response)=>{
                alert('Member  Added')
                location.reload()
            }
            
        })
    }else{
        alert('The Limit of Grupe reched')
    }
    
}
function removeMemberGrupe(memberId,payment,grupId){

    $.ajax({
        url:'/admin/remove-from-grupe',
        data:{
            memberID:memberId,
            payment:payment,
            grup:grupId
        },
        method:'post',
        success:(response)=>{
            alert('item Removed Success Fully')
            location.reload()
        }
        
    })


}
function cashpay(memberID,grup){
   
      
        $.ajax({
            url: '/place-order',
            method: 'post',
            data: $("#checkout-form").serialize(),
            success: (response) => {
                if (response.codSuccess) {
                    location.href = "/order-placed"
                } else {
                    
                    
                }
            }

        })
}
function addGift(grupId,grupe){
    $.ajax({
        url:'/admin/giv-gift',
        data:{
            
            grupId:grupId,
            grupe:grupe
        },
        method:'post',
        success:(response)=>{
            alert('Gift Wone to this')
            location.reload()
        }
        
    })
}