export interface Post {
    _id?:string;
    userLogo: string;
    clubName: string;
    postTime: string;
    imageUrl: string | ArrayBuffer | null;
    videoUrl: string | ArrayBuffer | null;
    content: string;
    sharesCount: number;
    comments: Comment[];
    likesCount: number;
    liked: boolean;
    showOptions: boolean;
    createdAt: string;
  }
  
  export interface Comment {
    text: string;
    showOptions: boolean;
    editing: boolean;
  }