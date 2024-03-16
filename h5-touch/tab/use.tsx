<Tabs
                    active={activePage}
                    autoHeight={false}
                    tabs={[
                        {
                            key: Pages.ForYou,
                            loadFn: () =>
                                import(
                                    /* webpackChunkName: "CommunityForyou" */ '@/containers/community/pages/for-you'
                                ),
                        },
                        {
                            key: Pages.Following,
                            loadFn: () =>
                                import(
                                    /* webpackChunkName: "CommunityFollowing" */ '@/containers/community/pages/following'
                                ),
                        },
                        {
                            key: Pages.Academy,
                            loadFn: () =>
                                import(
                                    /* webpackChunkName: "CommunityAcademy" */ '@/containers/community/pages/academy'
                                ),
                        },
                        {
                            key: Pages.Announcement,
                            loadFn: () =>
                                import(
                                    /* webpackChunkName: "CommunityAnnouncement" */ '@/containers/community/pages/announcement'
                                ),
                        },
                    ]}
                    onChange={setActivePage}
                />