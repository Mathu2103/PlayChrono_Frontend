export type UserRole = 'guest' | 'student' | 'captain' | 'admin';

export type RootStackParamList = {
    Welcome: undefined;
    SignIn: undefined;
    SignUp: undefined;
    PlayerDashboard: undefined;
    CaptainDashboard: undefined;
    CaptainCalendar: undefined;
    AdminDashboard: undefined;
    NoticesList: undefined;
    NoticeDetail: { noticeId: string };
    CreateNotice: undefined;
};

export type NoticePriority = 'Urgent' | 'Important' | 'General';
export type NoticeSport = 'All' | 'Cricket' | 'Football' | 'Basketball' | 'Badminton';

export interface Notice {
    id: string;
    title: string;
    message: string;
    createdAt: Date;
    createdBy: {
        userId: string;
        name: string;
        role: 'Admin' | 'Captain';
    };
    targetAudience: NoticeSport;
    priority: NoticePriority;
}
