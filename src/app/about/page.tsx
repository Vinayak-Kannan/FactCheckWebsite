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
    { name: 'Haonan Zhou', description: 'Harry(Haonan) Zhou is a Master of Science in Business Analytics student at Columbia University with a strong background in data science and applied statistics. Before Columbia, he worked as a Data Scientist at Tencent, Apple and Kwaishou. Harry is passionate about bridging data science and business strategy to drive impactful decisions. He is now working on continuous data ingestion task for the website.',
      image: '/assets/Haonan Zhou.jpg' },
    { name: 'Gufeng Liu', description: 'Gufeng (Geoff) Liu is a master\'s student in Business Analytics at Columbia University, with a dual degree in Management Science & Engineering from Tsinghua University. He has interned as a data scientist and analyst at Apple, Nestlé, and SAS, working on data-driven decision-making, predictive modeling, and large-scale data processing. His primary role in this project was designing and implementing the continuous data ingestion pipeline to ensure efficient and scalable data processing.',
      image: '/assets/Gufeng Liu.jpg' },
    { name: 'Yuwei Ding', description: 'Yuwei (Darcie) Ding is a Master of Science in Business Analytics student at Columbia University. Before Columbia, she earned her Bachelor of Engineering from Zhejiang University and gained industry experience at Amazon Web Services and KPMG. Yuwei is particularly interested in leveraging data-driven insights for decision-making. She is currently working on real-time inference for the website.',
      image: '/assets/Yuwei Ding.jpg' },
    { name: 'Inas El Ouazguiti', description: 'Inas earned a Bachelor of Science in Computer Science from the University of South Florida in 2023 and is currently pursuing a Master of Science in Business Analytics at Columbia University. With a strong background in software engineering, she worked at companies like Goldman Sachs, VanEck, and CyberChasse, developing software solutions, automating workflows, and enhancing data processing capabilities. Her work focuses on building scalable systems, optimizing efficiency, and improving strategic product performance through data-driven insights.\n' +
          'As part of the MyFactWiki project, Inas is contributing to the real-time inference team, working on optimizing automated fact-checking and contextual analysis to enhance the accuracy and efficiency of information retrieval.',
      image: '/assets/Inas.jpg' },
    { name: 'Yanjie Wu', description: 'Yanjie Wu is a 2022 graduate from Fudan University with a Bachelor’s in Software Engineering. She worked as a Developer at Morgan Stanley before attending Columbia University to pursue a Master’s in IEOR department. In 2025, she joined the MyFactWiki project, primarily contributing to front-end development.',
      image: '/assets/Yanjie Wu.jpg' },
    { name: 'Shicheng Li', description: 'Shicheng (Frank) Li is a dual master\'s student in Business Analytics at Columbia University and Tsinghua University. He has a strong background in statistics and data science, with internship experience as a data scientist and analyst at Apple, Meituan, and Didi. With extensive experience in data science, he aims to apply machine learning techniques to solve business problems. In this project, his primary role was designing and developing the website for the fact-checking model.',
      image: '/assets/Shicheng Li.jpg' },
  ];

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>

        <Container sx={{ py: 6 }}>
          <Box mb={6}>
            <Typography variant="h4" component="h2" sx={{ textAlign: "center" }}gutterBottom >
              About the Project
            </Typography>
            <Typography variant="body1">
              Misinformation’s effects, particularly around climate issues, is a complex and evolving phenomenon that requires a collective approach to address effectively. Limited expert resources, biased ratings from crowdsourced veracity judgments, and low public trust without engagement in the fact-checking process are key challenges this project aims to address.
            </Typography>
            <Typography variant="body1" paragraph>
              We’re building MyFactWiki, a platform that leverages a transparent AI model combined with crowdsourced similarity assessments to scale expert veracity ratings and collaboratively verify climate news and information. Visit the Our Model page to explore the project’s data sources and modeling process. This project is a work in progress. Check out the Community page to contribute or reach out to us with any questions or thoughts you’d like to share.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" component="h2" sx={{ textAlign: "center" }} gutterBottom>
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

      </Box>
  );
};

export default AboutPage;