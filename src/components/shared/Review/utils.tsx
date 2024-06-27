export const resolveRating = (rating: number | null)=>{
    switch(rating){
      case 0:
        return {
          reaction: 'Despair',
          unicode: '😠'       
        };        
      case 2:
        return {
          reaction: 'Sad',
          unicode: '🙁'          
        };
      case 3:
        return {
          reaction: 'Okay',
          unicode: '🙂'
        };
      case 4:
        return {
          reaction: 'Happy',
          unicode: '😃'
        };
      case 5:
        return {
          reaction: 'Delight',
          unicode: '😍'
        }
    }
  };