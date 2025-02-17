import React from 'react';
import { Container, Typography, Card, CardContent, Avatar, Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';


const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Gita V. Johar',
      description:
          'Gita V. Johar (PhD NYU 1993; MBA Indian Institute of Management Calcutta 1985) has been on the faculty of Columbia Business School since 1992 and is currently the Meyer Feldberg Professor of Business. Professor Johar’s expertise lies in consumer psychology, focusing on consumer identity, beliefs, motivation, and persuasion as they relate to branding, advertising, and media and she has published widely in these areas. Her current research examines consumer interactions with technology, aims to understand and mitigate the effects of misinformation, and studies how to use psychological principles to inspire consumers to combat climate change.',
      image: '/assets/profJohar.jpeg',
    },
    {
      name: 'Yu Ding',
      description:
          'Yu Ding is an assistant professor of marketing at Stanford Graduate School of Business. He received his PhD in marketing from Columbia University. His research has been published in top marketing, management, psychology, and interdisciplinary journals, including the Journal of Consumer Research, Journal of Marketing Research, Organizational Behavior and Human Decision Processes. His research focuses on trust, debiasing, misinformation, and social media.',
      image: '/assets/profDing.webp',
    },
    {
      name: 'Vinayak Kannan',
      description:
          'Vinayak Kannan is a 2020 graduate from the University of Michigan with a Bachelor’s in Business Administration. He worked as a Consultant at McKinsey and Company and at several startups as a Software Engineer before attending Columbia University to pursue a Master of Computer Science. He is collaborating on the MyFactWiki project to develop a topic modeling pipeline that automates and scales a trustworthy, fact-checking pipeline to combat misinformation. His primary contributions include building/designing the model architecture and assisting teammates in creating an end-to-end website showcasing their work.',
      image: '/assets/Vin.jpg',
    },
    {
      name: 'Nikita Vashisht',
      description:
          'Nikita Vashisht is a journalist focused on combating mis- and disinformation. With a background in fact-checking and data journalism, she has worked with multiple news organizations and holds a degree from Columbia University’s Graduate School of Journalism. At MyFactWiki, Nikita contributes to various aspects of the project, including user interface design, monitoring and identifying climate change denial sources, user testing, and developing crowdsourcing methods to engage citizen fact-checkers.',
      image: '/assets/Nikita.svg',
    },
    { name: 'Jiaqi Li', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
    { name: 'Haiwen Kou', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Haiwen.svg' },
    { name: 'Xinran She', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
    { name: 'Shan Hui', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Haiwen.svg' },
    { name: 'Ruoxuan Li', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
    { name: 'Haonan Zhou', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
    { name: 'Gufeng Liu', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Haiwen.svg' },
    { name: 'Yuwei Ding', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
    { name: 'Inas El Ouazguiti', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Haiwen.svg' },
    { name: 'Yanjie Wu', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
    { name: 'Shicheng Li', description: 'Graduate student at Columbia University’s Data Science Institute.', image: '/assets/Nikita.svg' },
  ];

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>

        <Container sx={{ py: 6 }}>
          <Box mb={6}>
            <Typography variant="h4" component="h2" gutterBottom >
              About the Project
            </Typography>
            <Typography variant="body1" paragraph>
              Misinformation’s effects, particularly around climate issues, is a complex and evolving phenomenon that requires a collective approach to address effectively. Limited expert resources, biased ratings from crowdsourced veracity judgments, and low public trust without engagement in the fact-checking process are key challenges this project aims to address.
            </Typography>
            <Typography variant="body1" paragraph>
              We’re building MyFactWiki, a platform that leverages a transparent AI model combined with crowdsourced similarity assessments to scale expert veracity ratings and collaboratively verify climate news and information. Visit the Our Model page to explore the project’s data sources and modeling process. This project is a work in progress. Check out the Community page to contribute or reach out to us with any questions or thoughts you’d like to share.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Team
            </Typography>
            <Grid2 container spacing={4}>
              {teamMembers.map((member, index) => (
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {member.image ? (
                            <Avatar src={member.image} alt={member.name} sx={{ width: 150, height: 150, mb: 2 }} variant="rounded" />
                        ) : (
                            <Avatar sx={{ width: 150, height: 150, mb: 2, bgcolor: 'grey.300' }} variant="rounded" />
                        )}
                        <Typography variant="h6" component="h3" align="center">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                          {member.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
              ))}
            </Grid2>
          </Box>
        </Container>

        <Box sx={{ bgcolor: 'grey.200', py: 4, mt: 6 }}>
          <Container>
            <Typography variant="body2" align="center">
              Copyright © 2024 MyFactWiki
            </Typography>
          </Container>
        </Box>
      </Box>
  );
};

export default AboutPage;